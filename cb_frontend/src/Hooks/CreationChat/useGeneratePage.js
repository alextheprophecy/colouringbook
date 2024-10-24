import { useState, useCallback } from 'react';
import api from '../../Hooks/ApiHandler'; // Assuming you have an API handler for making requests

const useGeneratePage = (bookCreationModel) => {
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const generatePage = useCallback(async () => {
        setLoading(true);
        const characters = bookCreationModel.getCharacters();
        const scenes = bookCreationModel.getScenes();
        
        try {
            const response = await api.post('image/generateSingleScenePage', {
                sceneDescription: scenes[scenes.length - 1], // Assuming the last scene is the one to generate
                characters,
                options: { forAdult: false } // Adjust options as needed
            });
            setImageUrl(response.data.image); // Assuming the API returns an imageUrl
        } catch (error) {
            console.error('Error generating page:', error);
        } finally {
            setLoading(false);
        }
    }, [bookCreationModel]);

 
};

export default useGeneratePage;
