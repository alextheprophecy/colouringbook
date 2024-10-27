const {query_gpt4o2024, query_formatted_gpt4o2024, query_formatted_gpt4o_mini, query_gpt4o_mini} = require("../external_apis/openai.controller");
const {z} = require('zod');

const DescriptionsController = () => {
    
    const contextObjectSchema = z.object({
        characters: z.array(z.object({
            name: z.string(),
            description: z.string(),
            lastSeenDoing: z.string(),  // Changed from currentState
        })),
        storySummary: z.string(),
        environment: z.string(),
        keyObjects: z.array(z.string()).optional(),
        currentSituation: z.string()
    });

    const generatePageDescriptionGivenContext = async (sceneDescription, bookContext, miniModel = true) => {
        const sys_prompt = `You are an expert in generating story scenes and creating visual descriptions for black-and-white coloring book images. Your task is to generate a new detailed scene description based on a given context. Follow these guidelines:
            1. Focus primarily on the new scene described.
            2. Use the book context only to maintain necessary continuity (e.g., character identities and key traits).
            3. Feel free to introduce creative elements and new settings as appropriate.
            4. Do not feel obliged to include all elements from the context in the new scene.
            5. Describe all elements in easy-to-visualize terms suitable for black-and-white line art.
            6. Focus on characters, their positions, clothing, and object interactions.
            7. Detail actions, body postures, and gestures explicitly.
            8. Avoid references to color, shading, dialogue, or abstract concepts.
            9. Create scenes that are easy for children to understand and should fit on a single page.`;
    
        const usr_prompt = `Generate a page description given the following:
        - New scene: "${sceneDescription}".
        - Book Context: "${JSON.stringify(bookContext)}".
        Your task is to create a detailed visual description for a black-and-white coloring book image based on the new scene, using the context only as needed for continuity. Focus on visual elements like character appearance, positioning, actions, and environment relevant to the new scene. Do not include characters or elements from the context that are not present or relevant in the new scene. Ensure consistency with key character traits from the context but feel free to introduce new creative elements. Avoid mentioning color, dialogue, thoughts, or complex details. Provide only the scene description.`;
    
        return (miniModel ? query_gpt4o_mini : query_gpt4o2024)(sys_prompt, usr_prompt);
    }

    const updateBookContext = async (newPageDescription, currentContext, miniModel = true) => {
        const systemPrompt = `You are an expert story analyst for children's visual storybooks. Your task is to maintain and update a comprehensive context object for the book, ensuring continuity and visual coherence across pages. Make sure to update descriptions that have changed, keep the context up to date, concise, and visual. Remove or update elements that are no longer relevant to the current story progression. Note: you are forbidden from mentioning colors.`;

        const userPrompt = `Current book context:
            ${JSON.stringify(currentContext, null, 2)}

            New page description:
            ${newPageDescription}

            Please update the book context object to include new information from this page. Maintain and update the following key elements:
            1.**Characters:** List only the important characters currently relevant to the story, with short, brief descriptions: a) name b) appearance, key traits, without colors c) lastSeenDoing - their action/state in their most recent appearance (not necessarily in this scene).
            2. **Story Summary:** A concise summary of the story so far.
            3. **Environment:** Very short description of the current setting location, in a few words. NEVER mention colors.
            4. **Key Objects:** List only the important items or objects that are central to the story's progression or have a significant impact on the plot. (examples: magical artifacts, treasure maps, or items the characters are seeking or using in a meaningful way. Do **not** include trivial or scene-setting items like background objects. Leave empty if none. Do not include characters here.
            5. **Current Situation:** The immediate context of the story at this point, in the present scene, in a few words as a note.

            Ensure all existing information is preserved unless explicitly changed by the new page. Add new elements as needed. The context should be short and snappy, maintaining visual and narrative consistency but concise enough for practical use.`;
        
        try {
            const result = await (miniModel ? query_formatted_gpt4o_mini : query_formatted_gpt4o2024) (systemPrompt, userPrompt, contextObjectSchema, "contextObjectSchema");
            return contextObjectSchema.parse(result);
        } catch (error) {
            console.error("Error updating book context:", error);
            throw error;
        }
    }

    const parseContextInput = (contextInput) => {
        try {
            return (!contextInput || contextInput === '') ? {
                characters: [],
                storySummary: '',
                environment: '',
                keyObjects: [],
                currentSituation: ''
            } : contextObjectSchema.parse(contextInput);
        } catch (error) {
            console.error("Error parsing context input:", error);
            throw error;
        }
    }

    return {
        updateBookContext,
        generatePageDescriptionGivenContext,
        contextObjectSchema,
        parseContextInput
    };
}

module.exports = DescriptionsController();
