const {queryFluxSchnell, queryFluxBetter, randomSavedSeed, randomSeed, queryFineTuned, queryFluxPro} = require("../external_apis/replicate.controller");
const Book2 = require("../../models/book2.model");
const {getFileData, image_data, saveBookPDF, savePageData, getPDF, log_data} = require("../user/files.controller");
const {updateBookContext, shouldUpdateBookContext, enhancePageDescription, generateConcisePageDescription, parseContextInput, generateCreativeSceneComposition, generateFinalImageDescription} = require("./descriptions_controller");
const {verifyCredits} = require("../user/user.controller");
const {uploadBuffer} = require("../external_apis/aws.controller");

const MAX_PAGE_COUNT = 6
const TWO_STEP_DESCRIPTION_GENERATION = true
const USE_SCHNELL_MODEL = true
const USE_FLUX_PRO_MODEL = false

const CREDIT_COSTS = [5, 3, 1]

const CHILD_PROMPT = (description)=>`Children's detailed black and white coloring page. ${description} Only black outlines, colorless, no shadows, no shading, black and white, coloring page.`
const ADULT_PROMPT = (description)=>`${description}. Adult's detailed coloring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`

const verifyPageCredits = async (user, usingModel) => {
    const creditCost = CREDIT_COSTS[usingModel];
    return await verifyCredits(user, creditCost);    
};

const _generateImage = async (user, book, pageNumber, description, {usingModel = 2, seed}) => { 
    try {
        if(!seed) seed = randomSeed();
        let imageData;
        usingModel = parseInt(usingModel);
        if (usingModel === 0)      
            imageData = await queryFluxPro(CHILD_PROMPT(description), seed);
        else if (usingModel === 1)  
            imageData = await queryFineTuned(`${description}`, {seed: seed});
        else
            imageData = await queryFluxSchnell(CHILD_PROMPT(description), seed);
        
        const { url, versionId } = await savePageData(user, book.id, pageNumber, imageData);
        return { url, seed, versionId };
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
};

const _generateDescription = async (sceneDescription, currentContext, isTwoStepGeneration = TWO_STEP_DESCRIPTION_GENERATION) => {
    if (isTwoStepGeneration) {
        // New two-step generation process
        const compositionIdea = await generateCreativeSceneComposition(sceneDescription, currentContext, false);
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
    const { sceneDescription, currentContext } = req.body;
    const { testMode, useAdvancedContext, generationSettings, credits } = req.generationData;

    if (!sceneDescription || sceneDescription.trim() === '') {
        return res.status(400).json({ error: 'No sceneDescription found' });
    }
 
    try {
        const parsedContext = parseContextInput(currentContext);   
        const descriptions = await _generateDescription(sceneDescription, parsedContext);

        let imageResult;
        let updatedContext = null;
        
        if (testMode) {
            imageResult = { url: descriptions.compositionIdea || descriptions.finalDescription, seed: null}            
        } else {
            [imageResult, updatedContext, _] = await Promise.all([
                _generateImage(user, book, book.pageCount, descriptions.finalDescription, generationSettings),
                updateBookContext(descriptions.finalDescription, parsedContext, miniModel=!useAdvancedContext),
                Book2.findByIdAndUpdate(book.id, { $inc: { pageCount: 1 } })])
        }

        res.status(200).json({ 
            detailedDescription: descriptions.finalDescription,
            updatedContext, 
            compositionIdea: descriptions.compositionIdea,
            image: imageResult.url, 
            seed: imageResult.seed,
            credits: credits
        });

    } catch (error) {
        console.error("Error in generatePageWithContext:", error);
        res.status(500).json({error: error.message || 'An error occurred while processing the request' });
    }
};

const regeneratePage = async (req, res) => {
    const user = req.user;
    const book = req.book;
    const { detailedDescription, currentPage } = req.body;
    const { testMode, generationSettings, credits } = req.generationData;

    if (!detailedDescription || detailedDescription.trim() === '') {
        return res.status(400).json({ error: 'No detailedDescription found' });
    }
    if (currentPage === undefined || !Number.isInteger(currentPage)) {
        return res.status(400).json({ error: 'Invalid page number' });
    }
    
    try {
        console.log('regenerating page with:', detailedDescription);

        const imageResult = testMode ? 
            { url: detailedDescription, seed: null} :
            await _generateImage(user, book, currentPage, detailedDescription, generationSettings);

        res.status(200).json({ 
            image: imageResult.url, 
            seed: imageResult.seed,
            credits: credits
        }); 
    } catch (error) {
        console.error('Error regenerating page:', error);
        res.status(500).json({ error: 'Failed to regenerate page' });
    }
}

const enhancePage = async (req, res) => {
    const user = req.user;
    const book = req.book;
    const { previousDescription, enhancementRequest, currentContext, currentPage } = req.body;
    const { testMode, generationSettings, credits } = req.generationData;

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

        const [imageResult, updatedContext] = await Promise.all([
            _generateImage(
                user, 
                book, 
                currentPage,
                enhancedDescription,
                generationSettings
            ),
            (async () => {
                const shouldUpdate = await shouldUpdateBookContext(enhancedDescription, currentContext);
                return shouldUpdate ? await updateBookContext(enhancedDescription, currentContext) : null;
            })()
        ]);

        res.status(200).json({ 
            enhancedDescription,
            updatedContext,
            image: imageResult.url,
            seed: imageResult.seed,
            credits: credits
        });
    } catch (error) {
        console.error('Error enhancing page:', error);
        res.status(500).json({ error: 'Failed to enhance page' });
    }
};

const getBookPDF = async (req, res) => {
    const user = req.user;
    const book = req.book;
    
    try {
        // If PDF already exists, return its URL
        if (book.finished) {
            const pdfUrl = await getPDF(user, book);
            console.log('sending pdfUrl:', pdfUrl);
            return res.status(200).json({ bookPDF: pdfUrl });
        }
        // If book has no pages, return error
        if (book.pageCount === 0) {
            return res.status(400).json({ error: 'Cannot get PDF for a book with no pages' });
        }
        // Generate PDF if it doesn't exist
        const pdfUrl = await _generateBookPDF(user, book);
        res.status(200).json({ bookPDF: pdfUrl });
    } catch (error) {
        console.error('Error in getBookPDF:', error);
        res.status(500).json({ error: 'Failed to get book PDF' });
    }
};

const finishBook = async (req, res) => {
    const user = req.user;
    const book = req.book;
    const { bookData } = req.body;

    try {
        if (book.pageCount === 0) {
            return res.status(400).json({ error: 'Cannot finish a book with no pages' });
        }
        // Create log content
        const logContent = JSON.stringify(bookData, null, 2);

        // Upload log file and generate PDF in parallel
        const [uploadResult, pdfUrl] = await Promise.all([
            // Upload log file
            uploadBuffer(
                Buffer.from(logContent),
                {   
                    key: log_data(user.email, book.id).key,
                    contentType:'text/plain'
                }
            ),
            // Generate PDF
            _generateBookPDF(user, book)
        ]);

        if (!uploadResult || !pdfUrl) {
            throw new Error(`Failed to finish book - error saving data, missing ${uploadResult ? '' : 'uploadResult'} ${pdfUrl ? '' : 'pdfUrl'} (${JSON.stringify(uploadResult)}, ${JSON.stringify(pdfUrl)})`);
        }else{
            res.status(200).json({ 
                bookPDF: pdfUrl,
                message: 'Book finished successfully'
            });
        }

    } catch (error) {
        console.error('Error in finishBook:', error);
        res.status(500).json({ error: 'Failed to finish book' });
    }
};

const _generateBookPDF = async (user, book) => {  
    if (book.pageCount === 0) throw new Error('Cannot generate PDF for a book with no pages');        

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
    return pdfUrl;
};

module.exports = {
    generatePageWithContext,
    regeneratePage,
    enhancePage,
    getBookPDF,
    finishBook
}
