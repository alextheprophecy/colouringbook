const OpenAI = require("openai");
const openai = new OpenAI();

const queryChatGPT = (prompt) => {
    return openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    }).then(completion => completion.choices[0].message.content);
}

const getPagesDescription = (descriptions) => {
    return JSON.parse(descriptions).pageDescriptions
}

const queryPagesDescriptions = (pageCount, childPreferences) => {
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
                        "type": "text", "text": `Generate exactly ${pageCount} pages of a children's colouring book. Give the page descriptions to generate random black and white images with a standard diffusion model. The child likes ${childPreferences}.Give short, simple little creative scenes for each page, but keep the descriptions simple for generation, and only include a few preferences in each image.`
                    }
                ]
            }],
        }).finalFunctionCallResult()//.on('functionCall', (message) => console.log("Called description function, params: \n", message));
}


const handleQuery = (req, res) => {
    const count = req.query.imageCount
    const childPreferences = req.query.preferences
    queryPagesDescriptions(count, childPreferences).then(a=> {
        res.send(a)
    })
}


module.exports = {
    queryChatGPT,
    handleQuery,
    queryPagesDescriptions
}