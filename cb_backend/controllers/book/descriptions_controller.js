const {query_gpt4o2024, query_formatted_gpt4o2024, query_formatted_gpt4o_mini, query_gpt4o_mini} = require("../external_apis/openai.controller");
const {z} = require('zod');

const DescriptionsController = () => {
    
    const contextObjectSchema = z.object({
        characters: z.array(z.object({
            name: z.string(),
            description: z.string(),
            currentState: z.string(),
        })),
        storySummary: z.string(),
        environment: z.string(),
        keyObjects: z.array(z.string()).optional(),
        currentSituation: z.string()
    });

    const generatePageDescriptionGivenContext = async (sceneDescription, bookContext, miniModel = true) => {                
        const sys_prompt = `You are an expert in generating story scenes and creating visual descriptions for black-and-white coloring book images. Your task is to generate a new detailed scene description, based on a given context. Follow these guidelines:
            1. Describe all elements in easy-to-visualize terms.
            2. Focus on characters, their positions, clothing, and object interactions.
            3. Detail actions, body postures, and gestures explicitly.
            4. Maintain coherence with the book's context and character descriptions.
            5. Avoid references to color, shading, dialogue, or abstract concepts.
            6. Ensure descriptions suit simple black-and-white line art.
            7. Create scenes that are easy for children to understand, and should fit on a single page.
            8. Get creative, you do not need to use all the elements from the context`;
            // 8. Incorporate key story elements and maintain narrative consistency.

        const usr_prompt = `Generate a page description given the following: New scene: "${sceneDescription}". Book Context: "${JSON.stringify(bookContext)}". Generate a detailed visual description for a black-and-white coloring book image based on the above scene and context. Focus on visual elements like character appearance, positioning, actions, and environment. Ensure consistency with the book context and include key visual elements. Avoid mentioning color, dialogue, thoughts, or complex details. Provide only the scene description.`;

        return (miniModel ? query_gpt4o_mini : query_gpt4o2024)( sys_prompt, usr_prompt )
    };

    const updateBookContext = async (newPageDescription, currentContext, miniModel = true) => {
        const systemPrompt = `You are an expert story analyst for children's visual storybooks. Your task is to maintain and update a comprehensive context object for the book, ensuring continuity and visual coherence across pages. Make sure to update descriptions that have changed, and keep the context up to date, concise and visual.`;

        const userPrompt = `Current book context:
            ${JSON.stringify(currentContext, null, 2)}

            New page description:
            ${newPageDescription}

            Please update the book context object to include new information from this page. Maintain and update the following key elements:
            1. Characters: List of only the important characters with short, brief descriptions: a) name b) appearance, key traits c) current expression/pose/state in the latest scene. Avoid adding characters that are not important for the story.
            2. Story Summary: A concise summary of the story so far.
            3. Environment: Description of the current setting or any significant locations.
            4. Key Objects: Description of important items or objects that are part of the story. Leave empty if none. Do not put characters in here.
            5. Current Situation: The immediate context of the story at this point, in the present scene.

            Ensure all existing information is preserved unless explicitly changed by the new page. Add new elements as needed. The context should be short and snappy, maintaining visual and narrative consistency but concise enough for practical use.`;
        
        try {
            const result = await (miniModel ? query_formatted_gpt4o_mini : query_formatted_gpt4o2024) (systemPrompt, userPrompt, contextObjectSchema, "contextObjectSchema");
            return contextObjectSchema.parse(result);
        } catch (error) {
            console.error("Error updating book context:", error);
            throw error;
        }
    }
    

    return {
        updateBookContext,
        generatePageDescriptionGivenContext,
        contextObjectSchema
    };
}

module.exports = DescriptionsController();
