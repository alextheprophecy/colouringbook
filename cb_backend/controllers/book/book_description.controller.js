const {query_gpt4o2024, query_formatted_gpt4o2024} = require("../external_apis/openai.controller")
const {z} = require('zod')

const sys_AdvancedStory = (pageCount) =>
    `You are an expert children's book writer. Your role is to create a simple, imaginative, and coherent story for a coloring-book in ${pageCount} scenes. 
    Each scene should have a clear transition to the next, ensuring continuity between them. 
    Focus on distinct and persistent character features (e.g., a frog with a small hat or a man with a striped small shirt). 
    Do not include any mention of colors, as this will be a black-and-white coloring-book. 
    Provide the story in ${pageCount} scenes with engaging actions and interactions for each scene.`;

const usr_AdvancedStory = (preferences, pageCount) =>
    `${preferences} Provide an outline with ${pageCount} scenes.`

const sys_AdvancedPages = (pageCount) =>
    `You are an expert in creating detailed black-and-white coloring-book descriptions for generating ${pageCount} pages. 
    Each scene should follow the flow of a given storyline, with character and environment continuity between pages. 
    Describe the characters in detail, with persistent features such as clothing, body language, and expressions. 
    Ensure that the actions and objects are spatially clear. Avoid all mentions of color.`;

const usr_AdvancedPages = (storyOutline, pageIndex) =>
    `Based on the following scene from the story outline:
    "${storyOutline[pageIndex]}"
    Provide a detailed description of the scene for generating a black-and-white coloring-book page, focusing on consistency in character features and environment.`;


const sys_SimpleStory = (pageCount) =>
    `You are an expert children's story designer. Your role is to create a simple, imaginative, and coherent story for a coloring-book in ${pageCount} scenes. 
    Each scene should have a clear transition to the next, ensuring continuity between them.
    Focus on distinct and persistent character features (e.g., a frog with a small hat or a superhero with a torn cape). 
    Do not include any mention of colors, as this will be a black-and-white coloring-book. 
    Provide the story in a paragraph in ${pageCount} scenes.`;

const usr_SimpleStory = (preferences, pageCount) =>
    `${preferences}. From these ideas, provide an exiting children's story with ${pageCount} scenes.`

const sys_SimplePages = (pageCount) =>
    `You are an expert in creating highly detailed, precise descriptions for generating ${pageCount} black-and-white coloring-book images. 
    Your role is to describe every element of the scene clearly, ensuring no assumptions are made about common terms, objects or characters. 
    Provide comprehensive details about spatial positioning, anatomy, and the interaction between characters and objects. When actions or movements are involved,
    describe them explicitly, including body positions, gestures, facial expressions, and physical surroundings. For example, if a character is standing, 
    specify the orientation of their body, the position of their limbs, and their interaction with the environment. 
    You must repeat the characters' appearance and clothes descriptions across all similar scenes. Maintain coherence with character descriptions. Avoid vague language or assumptions
    about common objects, and do not reference any colors. Each description should enable the generation of clear, accurate black-and-white line art.`;

const usr_SimplePages = (story, pageCount) =>
   `Give ${pageCount} page-image descriptions of the following scenes to generate black-and-white coloring-book images.
    Repeat character appearances and environment descriptions for every scene, to maintain continuity between the pages.
    ${story} Use the page_descriptions_response Object to return an array of $\{pageCount} page descriptions and page titles.`


const storyAdvanced = (preferences, pageCount, forAdult=false) => {
    query_gpt4o2024(sys_AdvancedStory(pageCount),
        usr_AdvancedPages(preferences, pageCount)).then(story => {
    })
}

const page_descriptions_response = (pageCount) => z.object({
    pages_array: z.array(z.object({page_title: z.string(), page_description: z.string()}))
})

const pagesSimpleStory = (preferences, pageCount, forAdult=false) => {
    return query_gpt4o2024(sys_AdvancedStory(pageCount), usr_SimpleStory(preferences, pageCount)).then(story => {
        console.log('STORY TIME: ', story)

        return query_formatted_gpt4o2024(sys_SimplePages(pageCount), usr_SimplePages(story, pageCount),
            page_descriptions_response(pageCount), 'page_descriptions_response').then(pageDescriptionsZOD => {
                return pageDescriptionsZOD.pages_array
        })
    })
}


module.exports = {
    storyAdvanced,
    pagesSimpleStory
}