const OpenAI = require("openai");
const openai = new OpenAI()

const { zodResponseFormat } = require('openai/helpers/zod')
const { z } = require('zod')

// Improved prompt with clear instructions for image generation
const childPrompt = (childPreferences, imageCount) =>
    `You are generating a children's coloring book. Generate ${imageCount} detailed and coherent descriptions to create black-and-white pages.
     These images should feature clean lines and no color information. Be specific in spatial positioning, distinct features, and anatomy.
    The child likes: ${childPreferences}. Favour concrete descriptions over vague,general adjectives.`;

const adultPrompt = (adultPreferences) =>
    `You are generating an adult coloring book. Generate six detailed and coherent descriptions to create black-and-white pages with intricate line art. Avoid color details and focus on complex shapes, textures, and patterns that are clear for coloring. 
    The adult prefers: ${adultPreferences}. 
    Important: Ensure complete and accurate anatomy for figures, and make scenes interesting but not over-complicated. Avoid generic descriptions like 'beautiful' or 'whimsical'.`;

const queryChatGPTMini = (prompt) => {
    return openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    }).then(completion => completion.choices[0].message.content);
}

const getPagesDescription = (descriptions) => {
    console.log(descriptions)
    return JSON.parse(descriptions).pageDescriptions
}

const queryPagesDescriptions = (pageCount, book_preferences, forAdult= false) => {

    const preferences = forAdult?adultPrompt(book_preferences):childPrompt(book_preferences)
    const tools =  [
        {
            type: "function",
            function: {
                "function": getPagesDescription,
                parse: "JSON.parse",
                description: `Returns an array of ${pageCount} page descriptions`,
                parameters: {
                    type: "object",
                    properties: {
                        pageDescriptions: {
                            "type": "array",
                            items: {
                                type: "string",
                                description: "The description for the page"
                            },
                            itemCount: 3,
                            required: ['items']
                        }
                    },
                    required: [
                        "pageDescriptions"
                    ]
                }
            }
        }]

    return openai.beta.chat.completions.runTools(
        {
            model: "gpt-4o-mini",
            tools: tools,
            tool_choice: {"type": "function", "function": {"name": "getPagesDescription"}},
            messages: [{ role: "user",
                content: [
                    {
                        "type": "text", "text": `Generate exactly ${pageCount} pages of ${preferences} Give short and simple descriptions to generate simple little creative scenes for each page, and only include a few preferences in each image.`
                    }
                ]
            }],
        }).finalFunctionCallResult()//.on('functionCall', (message) => console.log("Called description function, params: \n", message));
}

const pageObject = z.object({
    pageTitle: z.string(),
    pageDescription: z.string()
})

const pageDescriptionsResponse = z.object({
    pagesArray: z.array(pageObject),
})

const getPageDescriptions_2 = (pageCount, book_preferences, forAdult= false) => {
    const openaiModel = 'gpt-4o-2024-08-06'
    const systemPrompt = (pageCount) => `You are an expert in creating highly detailed, precise, and coherent descriptions 
        for generating ${pageCount} black-and-white coloring book images. Your job is to generate descriptive prompts that will be used to create clean line art, 
        suitable for children's or adults' coloring books through an AI Image Generation Model. Focus on providing concise details about
         spatial positioning, anatomy and object/character description without color descriptions. 
         Describe specific actions/Ensure continuity and coherence between the ${pageCount} pages.
         Avoid vague adjectives and avoid color descriptions.`

    const systemPrompt2 = (pageCount) =>
        `You are an expert in creating highly detailed, precise, and coherent descriptions for generating ${pageCount} 
        black-and-white coloring book images. Your job is to generate descriptive prompts that will be used to create clean line art,
         suitable for children's or adults' coloring books through an AI Image Generation Model. Focus on providing concise, 
         yet thorough, details about spatial positioning, anatomy, and object/character descriptions. When actions or movements are involved,
          describe them clearly, specifying body positions, gestures, and the interaction between characters or objects. Dont take 
    Ensure that each action is natural and coherent within the scene. Maintain continuity and coherence between the ${pageCount} pages, ensuring clear transitions or thematic connections. Avoid vague adjectives and eliminate any mention of colors.`;

    const systemPrompt3 = (pageCount) =>
        `You are an expert in creating highly detailed, precise, and exhaustive descriptions for generating ${pageCount} black-and-white coloring book images. 
    Your role is to describe every element of the scene clearly, ensuring no assumptions are made about common terms or objects. 
    Provide comprehensive details about spatial positioning, anatomy, and the interaction between characters and objects. When actions or movements are involved, describe them explicitly, including body positions, gestures, facial expressions, and physical surroundings. 
    For example, if a character is standing, specify the orientation of their body, the position of their limbs, and their interaction with the environment. 
    Ensure continuity and thematic coherence across all ${pageCount} pages. Avoid vague language or general terms and remove any references to color. 
    Every description must enable the generation of clear, accurate black-and-white line art without relying on assumptions.`;

    const userPrompt = childPrompt(book_preferences, pageCount)

    console.log('prompting')
    return openai.beta.chat.completions.parse({
        model: openaiModel,
        messages: [
            {"role": "system", "content": systemPrompt3(pageCount)},
            {"role": "user", "content": `${userPrompt} Use the pageDescriptionsResponse Object to return an array of ${pageCount} page descriptions.`},
        ],
        response_format: zodResponseFormat(pageDescriptionsResponse, 'pageDescriptionsResponse'),
    }).then( res => {

        const message = res.choices[0]?.message;
        if (message?.parsed) return message.parsed.pagesArray
        else throw new Error(`Error generating book descriptions using openai API for ${openaiModel}. Refusal Error: ${message.refusal}`)
    });
}


module.exports = {
    queryChatGPTMini,
    queryPagesDescriptions,
    getPageDescriptions_2
}