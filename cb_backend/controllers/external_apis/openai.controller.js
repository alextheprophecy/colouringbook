const OpenAI = require("openai");
const openai = new OpenAI()
const { zodResponseFormat } = require('openai/helpers/zod')

const _gpt_chat_complete = openaiModel => (systemPrompt, userPrompt) => {
    return openai.chat.completions.create(
        {
            model: openaiModel,
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: userPrompt}
            ]
        }).then(completion => completion.choices[0].message.content)
}

const _gpt_chat_complete_formatted = openaiModel => (systemPrompt, userPrompt, responseFormat, responseName) => {
    return openai.beta.chat.completions.parse(
        {
            model: openaiModel,
            messages: [
                {"role": "system", "content": systemPrompt},
                {"role": "user", "content": userPrompt}
            ],
            response_format: zodResponseFormat(responseFormat, responseName)
        }).then( res => {
            const message = res.choices[0]?.message;

            if (message?.parsed) return message.parsed
            else throw new Error(`Refusal Error: ${message.refusal}`)
        })
}

const query_gpt4o_mini = _gpt_chat_complete('gpt-4o-mini')

const query_gpt4o2024 = _gpt_chat_complete('gpt-4o-2024-08-06')

const query_formatted_gpt4o2024 = _gpt_chat_complete_formatted('gpt-4o-2024-08-06')

const query_formatted_gpt4o_mini = _gpt_chat_complete_formatted('gpt-4o-mini-2024-07-18')


module.exports = {
    query_gpt4o_mini,
    query_gpt4o2024,
    query_formatted_gpt4o2024,
    query_formatted_gpt4o_mini
}