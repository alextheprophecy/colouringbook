const {queryFluxSchnell, queryFluxBetter, randomSavedSeed} = require("../external_apis/replicate.controller");
const Book = require("../../models/book.model");
const {uploadBookImages, getImageData, saveBookPDF} = require("../user/files.controller");
const {pagesSimpleStory, AdvancedGenerator, generateScenePageDescription} = require("./book_description.controller");
const {updateBookContext, generatePageDescriptionGivenContext, contextObjectSchema} = require("./descriptions_controller");

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

const generatePageWithContext = async (req, res) => {
    const user = req.user;
    const { sceneDescription, currentContext } = req.body;

    try {
        if (!sceneDescription) return res.status(400).json({ error: 'Missing sceneDescription in request body' })        
        
        const parsedContext = (!currentContext || currentContext === '') ? {
                characters: [],
                storySummary: '',
                environment: '',
                keyObjects: [],
                currentSituation: ''
            } :  contextObjectSchema.parse(currentContext);
        
        
        const pageDescription = await generatePageDescriptionGivenContext(sceneDescription, parsedContext);

        //generate image
        const imageModel = queryFluxSchnell /* options.greaterQuality ? queryFluxBetter : queryFluxSchnell*/;
        
        const [image, updatedContext] = await Promise.all([
            imageModel(CHILD_PROMPT(pageDescription)),
            updateBookContext(pageDescription, parsedContext)
        ]);
        
        res.status(200).json({ detailedDescription: pageDescription, updatedContext, image });
        
    } catch (error) {
        console.error("Error in generatePageWithContext:", error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};

const regeneratePage = async (req, res) => {
    const user = req.user;
    const { detailed_description, currentContext } = req.body;
}

module.exports = {
    generateColouringBook,
    genBookPDF,
    test,
    generateSingleScenePage,
    generatePageWithContext
}
