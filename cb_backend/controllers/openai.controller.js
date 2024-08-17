const OpenAI = require("openai");
const openai = new OpenAI();

const queryChatGPT = (prompt) => {
    return openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    }).then(completion => completion.choices[0].message.content);
}

const getPagesDescription = (descriptions) => {
    console.log(descriptions)
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
                        "type": "text", "text": `Generate the pages of a children's colouring book. Make up random images to generate with a standard diffusion model and use the getPagesDescription function to pass each page desciption. The child likes ${childPreferences}.Get creative in assembling little scenarios and pictures for each page, but keep the descriptions concise and short for the Stable Diffusion model.`
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
    handleQuery
}