import { useState } from 'react';

const useGenerateImage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const generateImage = async (text) => {
        setIsLoading(true);
        try {
            // Replace this with your actual API call
            const response = await new Promise(resolve => 
                setTimeout(() => resolve({ newImage: `https://placehold.co/400x600?text=${text}` }), 1500)
            );
            return response.newImage;
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { generateImage, isLoading };
};

export default useGenerateImage;

