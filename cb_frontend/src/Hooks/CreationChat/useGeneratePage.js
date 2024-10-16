import { useState, useCallback } from 'react';

const useGeneratePage = (bookCreationModel) => {
    const [pageDescription, setPageDescription] = useState('');

    const generatePage = useCallback(() => {
        const characters = bookCreationModel.getCharacters();
        const scenes = bookCreationModel.getScenes();
        const description =  "Characters: " + characters.map(c => c.description).join(", ") +
             " | Scenes: " + scenes.join(", ");

        setPageDescription(description);
    }, [bookCreationModel]);

    return { pageDescription, generatePage };
};

export default useGeneratePage;