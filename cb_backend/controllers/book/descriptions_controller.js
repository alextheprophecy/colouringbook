const {query_gpt4o2024, query_formatted_gpt4o2024} = require("../external_apis/openai.controller");
const {z} = require('zod');

const DescriptionsController = () => {
    
    const contextObjectSchema = z.object({
        characters: z.array(z.object({
            name: z.string(),
            description: z.string()
        })),
        storySummary: z.string(),
        environment: z.string(),
        keyObjects: z.array(z.string()),
        currentSituation: z.string()
    });

    const generateScenePageDescriptionGivenContext = async (sceneDescription, bookContext) => {
        /* const sys_prompt = `You are an expert in generating clear, precise descriptions for generating a single black-and-white coloring book image.         
            Your goal is to describe every element of the scene in easy-to-visualize terms, ensuring no assumptions are made about common terms, objects, or characters.        
            Focus on essential visual elements: characters, their positions, clothing, and objects they interact with. 
            Describe any actions, body postures, or gestures explicitly. Specify things such as the orientation of characters' bodies, the position of their limbs, and their interaction with the environment.
            Maintain coherence with the characters' appearance and environment based on the scene description, by repeating important physical characteristics.
            Avoid references to colors, shading, dialogue, or abstract details. Stick to descriptions that will translate well into simple black-and-white, colorless line art.`;
    
        const usr_prompt = 
            `Based on the scene: "${sceneDescription}" and the current book context: ${JSON.stringify(bookContext)}, provide a clear and detailed description for generating a black-and-white coloring book image.
            The description should focus solely on visual elements such as character appearance, body positioning, physical actions, and interaction with the environment. 
            Ensure consistency with the book context, incorporating relevant details about characters, their current state, and the environment.
            Include key visual elements from the context, such as important objects or environmental details.
            Avoid any references to color, dialogue, thoughts, feelings, shading, or overly complex scene details. 
            The scene should be easy to understand, creating a simple, snapshot-style image for a child to color. Return only this scene description.`;
     */
                
        const sys_prompt = `You are an expert in creating visual descriptions for black-and-white coloring book images. Your task is to generate clear, detailed scene descriptions based on given contexts and outlines. Follow these guidelines:
            1. Describe all elements in easy-to-visualize terms.
            2. Focus on characters, their positions, clothing, and object interactions.
            3. Detail actions, body postures, and gestures explicitly.
            4. Maintain coherence with the book's context and character descriptions.
            5. Avoid references to color, shading, dialogue, or abstract concepts.
            6. Ensure descriptions suit simple black-and-white line art.
            7. Create scenes that are easy for children to understand and color.
            8. Incorporate key story elements and maintain narrative consistency.`;

        const usr_prompt = `Generate a page description given the following. Book Context: "${JSON.stringify(bookContext)}". New scene: "${sceneDescription}". Generate a detailed visual description for a black-and-white coloring book image based on the above context and scene. Focus on visual elements like character appearance, positioning, actions, and environment. Ensure consistency with the book context and include key visual elements. Avoid mentioning color, dialogue, thoughts, or complex details. Provide only the scene description.`;

        return query_gpt4o2024(sys_prompt, usr_prompt);
    };

    const updateBookContext = async (newPageDescription, currentContext) => {
        const systemPrompt = `You are an expert story analyst for children's visual storybooks. Your task is to maintain and update a comprehensive context object for the book, ensuring continuity and visual coherence across pages. Make sure to update descriptions that have changed, and keep the context up to date, concise and visual.`;

        const userPrompt = `Current book context:
            ${JSON.stringify(currentContext, null, 2)}

            New page description:
            ${newPageDescription}

            Please update the book context object to include new information from this page. Maintain and update the following key elements:
            1. Characters: List of characters with short, brief descriptions (appearance, key traits).
            2. Story Summary: A concise summary of the story so far.
            3. Environment: Description of the current setting or any significant locations.
            4. Key Objects: Description of important items or objects that are part of the story.
            5. Current Situation: The immediate context of the story at this point.

            Ensure all existing information is preserved unless explicitly changed by the new page. Add new elements as needed. The context should be short and snappy, maintaining visual and narrative consistency but concise enough for practical use.`;

        try {
            const result = await query_formatted_gpt4o2024(systemPrompt, userPrompt, contextObjectSchema, "contextObjectSchema");
            return contextObjectSchema.parse(result);
        } catch (error) {
            console.error("Error updating book context:", error);
            throw error;
        }
    };

    const generatePageDescriptionAndUpdateContext = async (req, res) => {
        try {
            const { sceneDescription, currentContext } = req.body;

            if (!sceneDescription) {
                return res.status(400).json({ error: 'Missing sceneDescription in request body' });
            }
            
            let parsedContext;
            if (!currentContext || currentContext === '') {
                // Initialize with empty arrays and strings if no context is provided
                parsedContext = {
                    characters: [],
                    storySummary: '',
                    environment: '',
                    keyObjects: [],
                    currentSituation: ''
                };
            } else {
                parsedContext = contextObjectSchema.parse(currentContext);
            }
            
            // Generate the page description first
            const newPageDescription = await generateScenePageDescriptionGivenContext(sceneDescription, parsedContext);
            
            // Then update the context using the generated page description
            const updatedContext = await updateBookContext(newPageDescription, parsedContext);
            
            res.status(200).json({
                pageDescription: newPageDescription,
                updatedContext: updatedContext
            });
        } catch (error) {
            console.error("Error in generatePageDescriptionAndUpdateContext:", error);
            res.status(500).json({ error: 'An error occurred while processing the request' });
        }
    };

    return {
        generatePageDescriptionAndUpdateContext
    };
}

module.exports = DescriptionsController();
