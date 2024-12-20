const {query_gpt4o2024, query_formatted_gpt4o2024, query_gpt4o_mini} = require("../external_apis/openai.controller")
const {z} = require('zod')

const sys_AdvancedStory = (pageCount) =>
    `You are an expert children's coloring-book designer. Your role is to create a simple, imaginative, and coherent story for a coloring-book in ${pageCount} scenes. 
    Each image-scene should be a clear transition to the next, ensuring continuity between them. Each scene should be a photographically capturable moment.
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
    `You are an expert children's story designer. Your role is to create a simple, imaginative, and coherent story for a coloring book in ${pageCount} scenes. 
    Each scene should include a clear transition to the next while ensuring continuity of characters and environment. 
    Reiterate the description of characters, their distinct features (e.g., a frog with a small hat or a superhero with a torn cape), and the environment in each scene, as if it is being described for the first time. 
    This will ensure consistent visuals throughout the story. 
    Avoid any mention of colors, as this will be a black-and-white coloring book. Provide the story in ${pageCount} scenes.`;

const usr_SimpleStory = (preferences, pageCount) =>
    `${preferences}. From these ideas, provide an exiting children's story with ${pageCount} scenes.`

const sys_SimplePages = (pageCount) =>
    `You are an expert in creating simple yet detailed descriptions for generating ${pageCount} black-and-white coloring book images. 
    Your role is to describe each scene as if it is a snapshot, focusing only on physical, drawable elements. 
    Ensure that the description for each character (species, size, clothing, and features) is consistent across all pages, repeating this information in every scene to maintain continuity. 
    Each scene must describe the physical positioning, anatomy, and interactions of the characters in relation to the environment. 
    Avoid any abstract concepts like thoughts or dialogue. Focus on capturing an interesting, visually appealing snapshot of the moment. 
    Keep the description uncluttered yet detailed enough to visualize clear character positions, actions, and background elements, supporting a black-and-white color-book line-art drawing.
    Avoid all references to colors.`;

/*`You are an expert in creating simple yet detailed descriptions for generating ${pageCount} black-and-white coloring book images.
Your role is to clearly describe the characters, their appearances, actions, and environments with minimal clutter.
Ensure that the description for each character (including their species, size, clothing, and features) is consistent across all pages, repeating this information in every scene to maintain continuity.
Focus on one or two primary actions or interactions per scene, keeping the description straightforward and easy to visualize.
Each scene should be simple but rich in detail, with clear spatial positioning of characters and objects.
Avoid any references to colors and make sure the description supports the generation of clear, black-and-white line art.`;*/

const usr_SimplePages = (story, pageCount) =>
    `Provide ${pageCount} detailed page descriptions for the following story, to generate black-and-white line-art coloring-book images.
    Each page should fully describe the main character(s) (species, size, clothing, features) as if being introduced for the first time, ensuring visual consistency. 
    Avoid any assumptions that the reader is familiar with the character from previous pages.
    The scene should be described like a snapshot, with no dialogue or internal thoughts—just what can be seen in the coloring-book image.
    Focus on describing the physical positioning and appearance of the characters, their actions, and the environment around them.
    Provide clear details about character anatomy, body positioning, and spatial relationships with other objects or characters in the scene.
    Make sure to avoid clutter or unnecessary details, and avoid any reference to color, while ensuring the scene is visually interesting.
    Story: ${story}.
    Return the result using the page_descriptions_response Object, with ${pageCount} coloring-book page descriptions and titles.`;

/*
    `Provide ${pageCount} detailed page descriptions for the following story, suitable for black-and-white coloring book images.
    Ensure that the main character(s) are fully described on each page (species, size, clothing, features) as if being introduced for the first time. 
    Avoid assuming familiarity with the character from previous pages. 
    Each page should repeat these descriptions and place the character in the context of that specific scene.
    Also describe the environment or background in a simple, uncluttered way that supports the character's actions or interactions.
    Avoid clutter, unnecessary details, or any references to color, while providing enough information for clear visual generation.
    Story: ${story}.
    Return the result using the page_descriptions_array_response Object, with ${pageCount} page descriptions and titles.`;*/

const page_descriptions_array_response = () => z.object({
    pages_array: z.array(page_description_response)
})

const page_description_response = () =>
    z.object({page_title: z.string(), page_description: z.string()})

//return array pageDescriptions
const pagesSimpleStory = (preferences, pageCount, forAdult=false) => {
    return query_gpt4o2024(sys_AdvancedStory(pageCount), usr_SimpleStory(preferences, pageCount)).then(story => {
        console.log('STORY TIME: ', story)

        return query_formatted_gpt4o2024(sys_SimplePages(pageCount), usr_SimplePages(story, pageCount),
            page_descriptions_array_response(), 'page_descriptions_array_response').then(pageDescriptionsZOD => {
            const pages_array = (pageDescriptionsZOD.pages_array).splice(0, pageCount)
            return Promise.all(pages_array.map((page, i) =>
                pageSummary(story, i, page.page_description).then(summary =>
                    ({...page, page_summary: summary}))
            ))
        })
    })
}


//return array pageDescriptions
const pagesAdvancedStory = (preferences, pageCount, forAdult=false) => {
    return query_gpt4o2024(sys_AdvancedStory(pageCount), usr_SimpleStory(preferences, pageCount)).then(story => {

    })
}

//return string page Summary
const pageSummary = (story, pageIndex, pageDescription) => {
    const sys_PageSummary =
        `You are an expert in creating fun, brief and engaging short scene notes, descriptions or dialogues for children's coloring books. 
        Your role is to read the story and the scene description and turn it into a short, creative, and fun one-two sentence note that children will enjoy. 
        This note should match the tone of a children's book, using simple language, and keeping the content easy to understand. Do NOT style the note.
         Do not add emojis or other symbols. Ensure that the note aligns with the story’s overall theme and characters, while keeping it appropriate for young readers. Mention some colours to help
        guide the children in colouring the book.`

    const usr_PageSummary = (story, sceneIndex, pageDescription) =>
        `Here is a children's story: 
        "${story}"    
         We are on scene ${sceneIndex}. Here is the description of the scene:    
        "${pageDescription}"
        Please create a brief, fun summary, note, or dialogue that we can put next to this coloring book image. Make sure it is playful, only one or two sentences long and suitable for children.`

    return query_gpt4o_mini(sys_PageSummary, usr_PageSummary(story, pageIndex, pageDescription))
}

class AdvancedGenerator {
    static MAX_PAGES = 6

    static sys_AdvancedStory = (pageCount) =>
        `You are an expert in creating detailed and exciting story outlines for children's coloring books. 
        Your task is to create a coherent and engaging storyline that can be split into ${pageCount} pages. 
        The story should have clear progression and involve the main character(s) undertaking a simple adventure or activity. 
        Ensure that the story can easily be split into individual scenes, each suitable for illustration in a coloring book.
        Avoid abstract concepts and focus on creating scenarios that are fun and visually appealing. 
        Each scene should include physical actions or activities that can be depicted as a snapshot in the form of a black-and-white image.`

    static usr_AdvancedStory = (preferences, pageCount) =>
        `Generate a detailed story outline based on the following preferences: ${preferences}. 
        The story will be split into ${pageCount} pages for a coloring book, with each scene forming a page. 
        Keep the story simple but engaging, ensuring clear progression and actions in every part of the story. 
        Make sure that each part of the story can be easily translated into an image with physical actions and activities.`

/*

    static sys_AdvancedPages = (pageCount) =>
        `You are an expert in creating highly detailed, precise descriptions for generating ${pageCount} black-and-white coloring-book images. 
        Your role is to describe every element of a scene clearly, ensuring no assumptions are made about common terms, objects, or characters. 
        Provide comprehensive details about spatial positioning, anatomy, and the interaction between characters and objects. When actions or movements are involved,
        describe them explicitly, including body positions, gestures, facial expressions, and physical surroundings. 
        Specify the orientation of characters' bodies, the position of their limbs, and their interaction with the environment. 
        Repeat the characters' appearance and clothing descriptions across all similar scenes. Maintain coherence with character descriptions in the story.
        Avoid vague language, references to thoughts, dialogue, or colors. The description should enable the generation of clear, accurate black-and-white line art for a coloring book.`
*/

    static sys_AdvancedPages = (pageCount) =>
        `You are an expert in generating clear, precise descriptions for generating a single black-and-white coloring book image, as part of a ${pageCount}-page story.         
        Your goal is to describe every element of the scene in easy-to-visualize terms, ensuring no assumptions are made about common terms, objects, or characters.        
        Focus on essential visual elements: characters, their positions, clothing, and objects they interact with. 
        Describe any actions, body postures, or gestures explicitly. Specify things such as the orientation of characters' bodies, the position of their limbs, and their interaction with the environment.
        Maintain coherence with the characters’ appearance and environment based on the overall story description, by repeating important physical characteristics.
        Avoid references to colors, complex scenic elements, shading, or abstract details. Stick to descriptions that will translate well into simple black-and-white, colorless line art.`

    static usr_AdvancedPages = (storyOutline, currentPage, totalPageCount) =>
        `Based on the story outline: "${storyOutline}", provide a clear and detailed description for page ${currentPage} of ${totalPageCount}, meant to generate a black-and-white coloring book image. 
    The description should focus solely on visual elements such as character appearance, body positioning, physical actions, and interaction with the environment. 
    Repeat the character's appearance, clothing, and positioning within this page; to ensure consistency and remind us what the characters look like. 
    Avoid any references to color, dialogue, thoughts, feelings, shading, or overly complex scene details. 
    The scene should be easy to understand, creating a simple, snapshot-style image for a child to color.  Return the result using the page_description_response Object`

    /*

        static usr_AdvancedPages = (storyOutline, currentPage, totalPageCount) =>
            `Based on the following story outline: "${storyOutline}",
            provide a detailed description for page ${currentPage} of ${totalPageCount},
            suitable for generating a black-and-white coloring book image.
            Ensure that the description is precise and focused on visual elements only, such as character appearance, physical actions,
            body positioning, and interaction with the environment.
            Avoid any references to thoughts, feelings, or dialogue, and focus solely on what can be seen in a static, snapshot-style coloring book image.
            Repeat the character and environment description (appearance, clothing, and positioning) to maintain consistency across the coloring book story.
            Return the result using the page_description_response Object`
    */

    static advancedPageDescriptions = (preferences, pageCount) => {
        // First, generate the story outline
        return query_gpt4o2024(this.sys_AdvancedStory(pageCount), this.usr_AdvancedStory(preferences, pageCount))
            .then(storyOutline => {
                console.log('Generated Story Outline: ', storyOutline);

                // Now generate each page one by one
                const pageDescriptions = [];
                let pageIndex = 1;

                const generateNextPage = () => {
                    if (pageIndex > pageCount || pageIndex > this.MAX_PAGES) {
                        return Promise.resolve(pageDescriptions); // Return the array once all pages are generated
                    }

                    return query_formatted_gpt4o2024(
                        this.sys_AdvancedPages(pageCount),
                        this.usr_AdvancedPages(storyOutline, pageIndex, pageCount),
                        page_description_response(), 'page_description_response'
                    ).then(pageDescriptionZOD => {
                        pageDescriptions.push(pageDescriptionZOD);
                        pageIndex++;
                        return generateNextPage(); // Recursive call to generate the next page
                    });
                };

                return generateNextPage() // Start the page generation process
            })
    }
}

const generateScenePageDescription = (sceneDescription, characters) => {
    const characterDetails = `${characters.map(char => char.description).join(', ')}`
     //characters.map(char => `${char.name}: ${char.description}`).join(', ');

    const a= `You are an expert in creating detailed and visually engaging scenes for children's coloring books. 
    Your task is to clearly describe a single scene based on the given description and characters. 
    Ensure that each character's appearance, clothing, and positioning are clearly described, maintaining consistency with their descriptions. 
    Focus on creating a snapshot-style image that captures the essence of the scene, with clear spatial relationships between characters and objects. 
    Avoid any references to colors, dialogue, or abstract concepts. The description should be suitable for generating a black-and-white line-art coloring book image.`;

    const sys_prompt = `You are an expert in generating clear, precise descriptions for generating a single black-and-white coloring book image.         
        Your goal is to describe every element of the scene in easy-to-visualize terms, ensuring no assumptions are made about common terms, objects, or characters.        
        Focus on essential visual elements: characters, their positions, clothing, and objects they interact with. 
        Describe any actions, body postures, or gestures explicitly. Specify things such as the orientation of characters' bodies, the position of their limbs, and their interaction with the environment.
        Maintain coherence with the characters’ appearance and environment based on the scene description, by repeating important physical characteristics.
        Avoid references to colors, shading, dialogue, or abstract details. Stick to descriptions that will translate well into simple black-and-white, colorless line art.`

    const usr_prompt = 
        `Based on the scene: "${sceneDescription}" containing the characters: "${characterDetails}", provide a clear and detailed description for generating a black-and-white coloring book image.
        The description should focus solely on visual elements such as character appearance, body positioning, physical actions, and interaction with the environment. 
        Repeat the character's appearance, clothing, and positioning within this page; to ensure consistency and remind us what the characters look like. 
        Avoid any references to color, dialogue, thoughts, feelings, shading, or overly complex scene details. 
        The scene should be easy to understand, creating a simple, snapshot-style image for a child to color. Return only this scene description.`

    return query_gpt4o2024(sys_prompt, usr_prompt)
};

// Export the function if needed
module.exports = {
    pagesSimpleStory,
    pageSummary,
    AdvancedGenerator,
    generateScenePageDescription
}
