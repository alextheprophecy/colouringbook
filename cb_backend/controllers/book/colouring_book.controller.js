const {queryFluxSchnell, queryFluxBetter, randomSavedSeed, randomSeed} = require("../external_apis/replicate.controller");
const Book = require("../../models/book.model");
const Book2 = require("../../models/book2.model");
const {uploadBookImages, getImageData, saveBookPDF} = require("../user/files.controller");
const {pagesSimpleStory, AdvancedGenerator, generateScenePageDescription} = require("./book_description.controller");
const {updateBookContext, generatePageDescriptionGivenContext, parseContextInput} = require("./descriptions_controller");
const {uploadFromBase64URI, getFileUrl} = require("../external_apis/aws.controller");
const { query } = require("express");

const MAX_PAGE_COUNT = 6

const CHILD_PROMPT = (description)=>`Children's detailed coloring book. ${description}. Only black outlines, colorless, no shadows, no shading, black and white, no missing limbs, no extra limbs, coherent coloring book.`
const ADULT_PROMPT = (description)=>`${description}. Adult's detailed coloring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`

const generateColouringBook = (bookData, user) => {
    const onlyDescriptions = bookData.onlyDescriptions

    const imageCount = Number(Math.min(bookData.imageCount, MAX_PAGE_COUNT))
    const preferences = bookData.preferences
    const forAdult = bookData.forAdult
    const imageModel = bookData.greaterQuality?queryFluxBetter:queryFluxSchnell
    const gen_seed = randomSavedSeed()

    console.log(imageCount, preferences)
    return AdvancedGenerator.advancedPageDescriptions(preferences, imageCount, forAdult).then(pages_array => {
        let pageDescriptions = pages_array.map(p => p.page_description)// JSON.parse(a.choices[0].message.content).pagesArray//JSON.parse(a)
        let pageSummaries = pages_array.map(p => p.page_summary)// JSON.parse(a.choices[0].message.content).pagesArray//JSON.parse(a)
        console.log('results : ', pageDescriptions)

        if (pageDescriptions.length > imageCount) pageDescriptions = pageDescriptions.splice(0, imageCount)
        if (onlyDescriptions) return pageDescriptions

        console.log('going to query flux')
        return Promise.all(pageDescriptions.map(descr => imageModel((forAdult?ADULT_PROMPT:CHILD_PROMPT)(descr), gen_seed)))
            .then(images =>
                addNewBookToUser(user,
                    {description: preferences, pages: imageCount, seed: gen_seed, page_summaries: pageSummaries}
                ).then(newBook =>
                    uploadBookImages(user, newBook.id, images).then(_ => images)
                )
            )
    })
}

const addNewBookToUser = (user, {description, pages, seed, page_summaries}) => {
    const book = new Book({userId: user.id, description: description, pages: pages,
        gen_seed: seed, page_summaries: page_summaries})
    return book.save()
}

const test = (req, res) => {
    res.status(200).json('RESULT')
}

const genBookPDF = (user, book) =>
    Promise.all(Array.from({length: book.pages}, (_, i) => getImageData(user, book, i))).then(imageBuffers =>
        saveBookPDF(imageBuffers, user, book)
    )

const generateSingleScenePage = async (req, res) => {
    const user = req.user;
    const { sceneDescription, characters, options } = req.body;

    try {
        const imageModel = queryFluxSchnell /* options.greaterQuality ? queryFluxBetter : queryFluxSchnell*/;
        const gen_seed = randomSavedSeed();

        const description = await generateScenePageDescription(sceneDescription, characters)
        const prompt = options.forAdult ? ADULT_PROMPT(description) : CHILD_PROMPT(description);
        const image = await imageModel(prompt, gen_seed);
        res.status(200).json({ image });    
        
    } catch (error) {
        console.error('Error generating single scene page:', error);
        res.status(500).json({ error: 'Failed to generate scene page' });
    }
}


const savePageData = async (user, bookId, pageNumber, image) => {
    const key = `users/${user.email.replace('@', '-')}/${bookId}/p${pageNumber}/v_${Date.now()}.png`;
    const [presignedUrl, _] = await Promise.all([
        getFileUrl({key}),
        uploadFromBase64URI(image.href, {key})
    ])
    return presignedUrl;
}


const generatePageWithContext = async (req, res) => {
    const user = req.user;
    const { sceneDescription, currentContext, bookId} = req.body;
    console.log('generating page with:', sceneDescription);
    if (!bookId || !sceneDescription || sceneDescription.trim() === '') return res.status(400).json({ error: 'No sceneDescription found' });

    try {
        // Check if the Book2 entry with the given pageId exists
        const bookEntry = await Book2.findOne({userId: user.id, _id: bookId});
        if (!bookEntry) return res.status(404).json({ error: 'Book entry not found' });
        
        const parsedContext = parseContextInput(currentContext);        
        const pageDescription = await generatePageDescriptionGivenContext(sceneDescription, parsedContext, miniModel = true); //TODO: change to false and set models to better

        // Generate image
        const imageModel = queryFluxSchnell;
        const seed = randomSavedSeed();
        const [image, updatedContext] = await Promise.all([
            imageModel(CHILD_PROMPT(pageDescription), seed), //get href since image is a url object
            updateBookContext(pageDescription, parsedContext)
        ]);

        //save data to s3 and update book
        const [presignedUrl, _] = await Promise.all([
            savePageData(user, bookEntry.id, bookEntry.pageCount, image),                        
            Book2.findByIdAndUpdate(bookEntry.id, { $inc: { pageCount: 1 } })
        ]);

        console.log('presignedUrl:', presignedUrl);
        res.status(200).json({ detailedDescription: pageDescription, updatedContext, image: presignedUrl, seed });

    } catch (error) {
        console.error("Error in generatePageWithContext:", error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};



const regeneratePage = async (req, res) => {
    const user = req.user;
    const { detailedDescription, bookId, currentPage } = req.body;

    if (!detailedDescription || detailedDescription.trim() === '') return res.status(400).json({ error: 'No detailedDescription found' });
    if (currentPage === undefined || !Number.isInteger(currentPage)) return res.status(400).json({ error: 'Invalid page number' });
    
    try {
        const bookEntry = await Book2.findOne({userId: user.id, _id: bookId});
        console.log('bookEntry:', bookEntry);
        if (!bookEntry) return res.status(404).json({ error: 'Book entry not found' });

        console.log('regenerating page with:', detailedDescription);
        const seed = randomSeed();

        console.log('querying flux');
        const image = await queryFluxSchnell(CHILD_PROMPT(detailedDescription), seed);
        const presignedUrl = await savePageData(user, bookEntry.id, currentPage, image);

        res.status(200).json({ image: presignedUrl, seed }); 
    } catch (error) {
        console.error('Error regenerating page:', error);
        res.status(500).json({ error: 'Failed to regenerate page' });
    }
}

module.exports = {
    generateColouringBook,
    genBookPDF,
    test,
    generatePageWithContext,
    regeneratePage,
}
