const {queryFluxSchnell, queryFluxBetter, randomSavedSeed, randomSeed, queryFineTuned} = require("../external_apis/replicate.controller");
const Book2 = require("../../models/book2.model");
const {getFileData, image_data, saveBookPDF, savePageData, getPDF} = require("../user/files.controller");
const {updateBookContext, generatePageDescriptionGivenContext, enhancePageDescription, generateConcisePageDescription, parseContextInput, generateCreativeSceneComposition, generateFinalImageDescription} = require("./descriptions_controller");

const MAX_PAGE_COUNT = 6
const TWO_STEP_DESCRIPTION_GENERATION = true
const USE_SCHNELL_MODEL = false

const CHILD_PROMPT = (description)=>`Children's detailed coloring book. ${description}. Only black outlines, colorless, no shadows, no shading, black and white, no missing limbs, no extra limbs, coherent coloring book.`
const ADULT_PROMPT = (description)=>`${description}. Adult's detailed coloring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`

const _generateImage = async (user, book, pageNumber, description, {useFineTunedModel = false, seed = randomSeed()}) => {
    let imageData;
    
    if (useFineTunedModel)
        imageData = await queryFineTuned(`coloring page, ${description}`, {seed: seed});
    else
        imageData = await (USE_SCHNELL_MODEL?queryFluxSchnell:queryFluxBetter)(CHILD_PROMPT(description), seed);
    
    const presignedUrl = await savePageData(user, book.id, pageNumber, imageData);
    return { url: presignedUrl, seed };
};

const _generateDescription = async (sceneDescription, currentContext, isTwoStepGeneration = TWO_STEP_DESCRIPTION_GENERATION) => {
    if (isTwoStepGeneration) {
        // New two-step generation process
        const compositionIdea = await generateCreativeSceneComposition(sceneDescription, currentContext);
        const finalDescription = await generateFinalImageDescription(compositionIdea, currentContext);
        return {
            compositionIdea,
            finalDescription
        };
    } else {
        // Current single-step generation process
        const finalDescription = await generateConcisePageDescription(sceneDescription, currentContext, false);
        return {
            compositionIdea: null,
            finalDescription
        };
    }
}

const generatePageWithContext = async (req, res) => {
    const user = req.user;
    const book = req.book;  
    const { sceneDescription, currentContext, ...creationSettings} = req.body;
    console.log('generating page with:', sceneDescription, creationSettings);
    if (!sceneDescription || sceneDescription.trim() === '') return res.status(400).json({ error: 'No sceneDescription found' });

    const { testMode, useAdvancedContext, ...generationSettings } = creationSettings;

    try {
        const parsedContext = parseContextInput(currentContext);   
        const descriptions = await _generateDescription(sceneDescription, parsedContext);
        const updatedContext = await updateBookContext(descriptions.finalDescription, parsedContext, miniModel=!useAdvancedContext);

        let imageResult;
        if (testMode) {
            imageResult = { url: descriptions.compositionIdea || descriptions.finalDescription, seed: null}            
        } else {
            [imageResult, _] = await Promise.all([
                _generateImage(user, book, book.pageCount, descriptions.finalDescription, generationSettings),
                Book2.findByIdAndUpdate(book.id, { $inc: { pageCount: 1 } })])            
        }

        res.status(200).json({ 
            detailedDescription: descriptions.finalDescription,
            compositionIdea: descriptions.compositionIdea,
            updatedContext, 
            image: imageResult.url, 
            seed: imageResult.seed,
        });

    } catch (error) {
        console.error("Error in generatePageWithContext:", error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};

const regeneratePage = async (req, res) => {
    const user = req.user;
    const book = req.book;
    const { detailedDescription, currentPage, ...creationSettings } = req.body;

    const { testMode, ...generationSettings } = creationSettings;
    console.log('regenerating page test mode:', testMode);

    if (!detailedDescription || detailedDescription.trim() === '') return res.status(400).json({ error: 'No detailedDescription found' });
    if (currentPage === undefined || !Number.isInteger(currentPage)) return res.status(400).json({ error: 'Invalid page number' });
    
    try {
        console.log('regenerating page with:', detailedDescription);

        const imageResult = testMode ? 
            { url: detailedDescription, seed: null} :
            await _generateImage(user, book, currentPage, detailedDescription, generationSettings);

        res.status(200).json({ 
            image: imageResult.url, 
            seed: imageResult.seed,
        }); 
    } catch (error) {
        console.error('Error regenerating page:', error);
        res.status(500).json({ error: 'Failed to regenerate page' });
    }
}

const enhancePage = async (req, res) => {
    const user = req.user;
    const book = req.book;
    const { previousDescription, enhancementRequest, currentContext, currentPage, ...generationSettings } = req.body;
    
    if (!previousDescription || !enhancementRequest) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    try {
        // First get the enhanced description
        const enhancedDescription = await enhancePageDescription(
            previousDescription,
            enhancementRequest,
            currentContext
        );

        // Then generate a new image using the enhanced description
        const imageResult = await _generateImage(
            user, 
            book, 
            currentPage,
            enhancedDescription,
            generationSettings
        );

        res.status(200).json({ 
            enhancedDescription,
            image: imageResult.url,
            seed: imageResult.seed
        });
    } catch (error) {
        console.error('Error enhancing page:', error);
        res.status(500).json({ error: 'Failed to enhance page' });
    }
};

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
