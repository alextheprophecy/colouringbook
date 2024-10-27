const {queryFluxSchnell, queryFluxBetter, randomSavedSeed, randomSeed} = require("../external_apis/replicate.controller");
const Book2 = require("../../models/book2.model");
const {getFileData, image_data, saveBookPDF, savePageData, getPDF} = require("../user/files.controller");
const {updateBookContext, generatePageDescriptionGivenContext, parseContextInput} = require("./descriptions_controller");

const MAX_PAGE_COUNT = 6

const CHILD_PROMPT = (description)=>`Children's detailed coloring book. ${description}. Only black outlines, colorless, no shadows, no shading, black and white, no missing limbs, no extra limbs, coherent coloring book.`
const ADULT_PROMPT = (description)=>`${description}. Adult's detailed coloring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`


const generatePageWithContext = async (req, res) => {
    const user = req.user;
    const book = req.book;

    const { sceneDescription, currentContext} = req.body;
    console.log('generating page with:', sceneDescription);
    if (!sceneDescription || sceneDescription.trim() === '') return res.status(400).json({ error: 'No sceneDescription found' });

    try {
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
            savePageData(user, book.id, book.pageCount, image),                        
            Book2.findByIdAndUpdate(book.id, { $inc: { pageCount: 1 } })
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
    const book = req.book;
    const { detailedDescription, currentPage } = req.body;

    if (!detailedDescription || detailedDescription.trim() === '') return res.status(400).json({ error: 'No detailedDescription found' });
    if (currentPage === undefined || !Number.isInteger(currentPage)) return res.status(400).json({ error: 'Invalid page number' });
    
    try {
        console.log('regenerating page with:', detailedDescription);
        const seed = randomSeed();

        console.log('querying flux');
        const image = await queryFluxSchnell(CHILD_PROMPT(detailedDescription), seed);
        const presignedUrl = await savePageData(user, book.id, currentPage, image);

        res.status(200).json({ image: presignedUrl, seed }); 
    } catch (error) {
        console.error('Error regenerating page:', error);
        res.status(500).json({ error: 'Failed to regenerate page' });
    }
}

const enhancePage = async (req, res) => {
    const user = req.user;
    const { detailedDescription, bookId, currentPage } = req.body;
}

const getBookPDF = async (req, res) => {
    const user = req.user;
    const book = req.book;
    console.log('getting book pdf for book:', book);
    try {
        if (book.finished) {
            const pdfUrl = await getPDF(user, book);
            return res.status(200).send(pdfUrl);
        }
        if (book.pageCount === 0) return res.status(400).json({ error: 'Cannot finish a book with no pages' });        

        const _genBookPDF = (user, book) =>
            Promise.all(
                Array.from({length: book.pageCount}, (_, i) => 
                    getFileData(image_data(user.email, book.id, i).key))
            ).then(imageBuffers => saveBookPDF(imageBuffers, user, book));
        
        
        // Generate PDF, update book status, and get presigned URL concurrently
        const [uploadResult, updatedBook, pdfUrl] = await Promise.all([
            _genBookPDF(user, book),
            Book2.findByIdAndUpdate(
                book.id, 
                { finished: true },
                { new: true }
            ),
            getPDF(user, book)
        ]);

        if (!uploadResult || !updatedBook) throw new Error('Failed to finish book');
        
        console.log('sending pdfUrl:', pdfUrl);
        res.status(200).json({ bookPDF: pdfUrl });

    } catch (error) {
        console.error('Error in finishBook:', error);
        res.status(500).json({ error: 'Failed to finish book' });
    }
};


module.exports = {
    generatePageWithContext,
    regeneratePage,
    enhancePage,
    getBookPDF,
}
