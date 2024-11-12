const {query_gpt4o2024, query_formatted_gpt4o2024, query_formatted_gpt4o_mini, query_gpt4o_mini} = require("../external_apis/openai.controller");
const {z} = require('zod');

const DescriptionsController = () => {
    
    const contextObjectSchema = z.object({
        characters: z.array(z.object({
            name: z.string(),
            description: z.string(),
            lastSeenDoing: z.string(),
        })),
        storySummary: z.string(),
        environment: z.string(),
        keyObjects: z.array(z.string()).optional(),
        previousScene: z.string()
    });

    const UpdateStatus = Object.freeze({
        UPDATE_CONTEXT: "UPDATE_CONTEXT",
        NO_UPDATE: "NO_UPDATE"
    });

    const shouldUpdateBookContext = async (enhancementPrompt, currentContext, miniModel = true) => {
        const systemPrompt = `You are an expert in children's storybook continuity. Decide if an enhancement should update the book context.
        
        Guidelines:
        1. Return TRUE if the change:
           - Permanently alters a character’s appearance
           - Modifies the setting or environment long-term
           - Adds story-critical objects or elements
           - Affects future scenes (e.g., new food item, new setting)
        
        2. Return FALSE if the change is temporary or minor:
           - Temporary expressions or poses
           - Background adjustments (e.g., moving a tree)
           - One-time actions with no lasting impact`;
        
            const userPrompt = `Should this enhancement update the story context?
        - Enhancement: "${enhancementPrompt}"
        - Current Context: ${JSON.stringify(currentContext, null, 2)}
        
        Return TRUE if it introduces lasting changes; otherwise, return FALSE.`;

        const resultSchema = z.object({
            result: z.boolean()
        });       

        try {
            const result = await (miniModel ? query_formatted_gpt4o_mini : query_formatted_gpt4o2024) (systemPrompt, userPrompt, resultSchema, "result");
            console.log('context update needed:', result.result);
            return result.result;
        } catch (error) {
            console.error("Error evaluating context update need:", error);
            throw error;
        }
    };
    

    const enhancePageDescription = async (previousDescription, enhancementRequest, bookContext, miniModel = true) => {
        const sys_prompt = `You are an expert at refining and enhancing descriptions for black-and-white children's coloring book images. Your task is to make small, specific adjustments to an existing description based on a user request. Keep the original description intact, modifying only the relevant parts as specified in the enhancement request.
            Guidelines:
            1. Make only the changes specified in the enhancement request without altering any other part of the scene.
            2. Maintain simple, clear language to ensure the description is easy to visualize for children.
            3. Use the book context to keep continuity with character appearance, positioning, and background.
            4. Avoid adding new elements or altering composition unless explicitly requested.`;

    
        const usr_prompt = `Based on the enhancement request, update the previous page description while keeping it simple and clear:
        - Enhancement Request: "${enhancementRequest}"
        - Previous Description: "${previousDescription}"        
        - Relevant Context: "${JSON.stringify({
            characters: bookContext.characters,
            keyObjects: bookContext.keyObjects,
            environment: bookContext.environment,
        })}"
        
        Make the necessary adjustments to the description without drastically changing the original scene or adding unnecessary details.`;
    
        return (miniModel ? query_gpt4o_mini : query_gpt4o2024)(sys_prompt, usr_prompt);
    };
    
    const generateCreativeSceneComposition = async (sceneDescription, bookContext, miniModel = true) => {
        const sys_prompt = `You are an expert in creating concise, engaging scene compositions for black-and-white children's coloring books. Your goal is to design visually clear and uncluttered scenes that are easy for children to color and understand.
           Guidelines:    
            1. **Snapshot Description**: Generate a brief description focusing on a single moment or action in the scene.            
            2. **Visual Composition**: Describe only what is visually present, including characters, objects, and their interactions, without narrative exposition.            
            3. **Story Coherence**: Ensure the scene aligns with the story's continuity without restating the entire context.            
            4. **Selective Inclusion**: Include only necessary elements relevant to the current scene; omit characters or details not present in this specific moment.            
            5. **Clear Visual Cues**: Provide specific visual details like character poses, expressions, and positions to aid in composing the image.            
            6. **Simplicity**: Keep the composition straightforward and avoid unnecessary details that could clutter the image.            
            Your output should be a medium-length description suitable for an illustrator to create a single coloring book page. Do not include additional explanations, framing, or meta-commentary.`;            
        
        const usr_prompt = `Using the provided scene description and book context, describe a simple, child-friendly composition idea for a single image:    
            - **Scene Description**: "${sceneDescription}"
            - **Book Context**: ${JSON.stringify(bookContext)}        
            Focus on depicting what is visually present in the scene, providing a clear and concise description of the snapshot. Ensure the composition is engaging, easy for children to color, and coherent with the story.`;
            
        return (miniModel ? query_gpt4o_mini : query_gpt4o2024)(sys_prompt, usr_prompt);
    };
    
    
    const generateFinalImageDescription = async (compositionIdea, bookContext) => {
        const sys_prompt = `You are creating a detailed visual description for a black-and-white coloring book image based on a given composition idea and selected context. Emphasize clear, visual details without abstract concepts or unnecessary context.
            Guidelines:
            1. Use only the necessary context (like character details and environment).
            2. Describe the visual elements (e.g., character appearance, positioning, actions, and environment) in easy to visualize terms.
            3. Detail actions, body postures, and gestures explicitly. (e.g. "in the act of running, his left leg in the air infront of the other", "tumbling down the hill, his arms and legs outstretched and his body upside down", "the goalie is diving to the left with his arms stretched out, but the ball is behind him in the bottom right corner of the goal" )
            4. Avoid mentioning color, shading, abstract concepts, or any complex details outside of the scene.
            5. ONLY mention what is visible in the image, no need to precise any past details or anything besides the description of the visible scene.`;
    
        const usr_prompt = `Given the composition idea and context, generate a clear and detailed visual description:
        - Composition Idea: "${compositionIdea}".
        - Relevant Context: "${JSON.stringify({
            characters: bookContext.characters,
            keyObjects: bookContext.keyObjects,
            environment: bookContext.environment,
        })}".
    
        Create a description with clear visual details for the image generation model.`;
        
        return query_gpt4o2024(sys_prompt, usr_prompt);
    };
    
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

    const generateConcisePageDescription = async (sceneDescription, bookContext, miniModel = true) => {
        const sys_prompt = `You are an expert in generating concise scene descriptions for black-and-white coloring book images. Your task is to create short, visually rich scene prompts that capture essential elements in a concise way. Each description should feel like a cinematic snapshot that advances the story, easy to interpret in line art. Prioritize essential details about character actions, positions, and relevant surroundings. Avoid any mention of color, shading, thoughts, or dialogue. Each prompt should be engaging, easy for children to understand, and fit on a single page.`;
    
        const usr_prompt = `Create a concise scene description based on the following:
        - Scene: "${sceneDescription}".
        - Book Context: "${JSON.stringify(bookContext)}" (use only if it helps maintain character or setting continuity).
    
        Write a vivid but brief description of the scene, around three sentences. Emphasize key actions, character expressions, and relevant surroundings for a black-and-white coloring book image. Keep it clear, to the point, and visually engaging.`;
    
        return (miniModel ? query_gpt4o_mini : query_gpt4o2024)(sys_prompt, usr_prompt);
    };

    const updateBookContext = async (newPageDescription, currentContext, miniModel = true) => {
        const systemPrompt = `You are an expert story analyst for children's visual storybooks. Your task is to maintain and update a comprehensive context object for the book, ensuring continuity and visual coherence across pages. Make sure to update descriptions that have changed, keep the context up to date, concise, and visual. Remove or update elements that are no longer relevant to the current story progression. Note: you are forbidden from mentioning colors.`;

        const userPrompt = `Current book context:
            ${JSON.stringify(currentContext, null, 2)}

            New page description:
            ${newPageDescription}

            Please update the book context object to include new information from this page. Maintain and update the following key elements, while removing any old elements that are definitely no longer relevant:
            1. **Characters:** List only the important characters currently relevant to the story, with short, brief descriptions: a) name b) appearance, key traits, without colors c) lastSeenDoing - their action/state in their most recent appearance (not necessarily in this scene).
            2. **Story Summary:** A concise summary of the story so far.
            3. **Environment:** Very brief description of the current setting location, pin pointing the most important elements. NEVER mention colors.
            4. **Key Objects:** List only the important items or objects that are central to the story's progression or have a significant impact on the plot. (examples: magical artifacts, treasure maps, or items the characters are seeking or using in a meaningful way. Do **not** include trivial or scene-setting items like background objects. Leave empty if none. Do not include characters here.
            5. **Previous Scene:** A brief summary of the scene that just occurred (the newPageDescription), which will serve as context for the next page.

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
                previousScene: ''
            } : contextObjectSchema.parse(contextInput);
        } catch (error) {
            console.error("Error parsing context input:", error);
            throw error;
        }
    }


    return {
        updateBookContext,
        generatePageDescriptionGivenContext,
        generateConcisePageDescription,
        generateCreativeSceneComposition,
        generateFinalImageDescription,
        parseContextInput,
        enhancePageDescription,
        shouldUpdateBookContext
    };
}

module.exports = DescriptionsController();
