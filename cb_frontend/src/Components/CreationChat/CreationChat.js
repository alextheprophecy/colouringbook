import React, { useState, useEffect } from "react";
import Greeting from "./Greeting";
import ChoiceSelector from "./ChoiceSelector"; // Updated import
import StoryMode from "./StoryMode";
import ThemeMode from "./ThemeMode";

const CreationChat = () => {
    const SKETCHY_MASCOT = '/assets/textures/sketchy_mascot.png';
    const [mode, setMode] = useState(null);
    const [showModeSelection, setShowModeSelection] = useState(false);

    const choices = [
        { mode: 'story', label: 'Story Mode', bgColor: 'bg-yellow-400', textColor: 'text-gray-800', hoverBgColor: 'bg-yellow-300' },
        { mode: 'theme', label: 'Theme Mode', bgColor: 'bg-blue-500', textColor: 'text-white', hoverBgColor: 'bg-blue-400' },
        // Add more choices as needed
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowModeSelection(true);
        }, 2000); // Adjust this value based on the length of your greeting text

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-[90vw] max-w-3xl mx-auto mt-24 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
                <img 
                    src={SKETCHY_MASCOT} 
                    alt="Sketchy Mascot" 
                    className="w-24 h-24 object-contain mr-4"
                />
                <div>
                    <Greeting />
                </div>
            </div>
            <div className="flex flex-col justify-between">
                <div className="flex-grow">
                    {mode === "story" && <StoryMode />}
                    {mode === "theme" && <ThemeMode />}
                </div>
                <div className="mt-auto mb-4"> {/* Ensures the buttons are at the bottom */}
                    {showModeSelection && !mode && <ChoiceSelector choices={choices} setMode={setMode} />}
                </div>
            </div>
        </div>
    );
};

export default CreationChat;