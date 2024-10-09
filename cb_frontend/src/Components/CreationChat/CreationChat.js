import React, { useState, useEffect } from "react";
import ChoiceSelector from "./ChoiceSelector";
import Message from "./Message";
import usePersistentState from "../../Hooks/CreationChat/usePersistentState"

const CreationChat = () => {
    const SKETCHY_MASCOT = '/assets/textures/sketchy_mascot.png';
    const [stageNumber, setStageNumber] = usePersistentState('stageNumber', 0);
    const [currentStageType, setCurrentStageType] = usePersistentState('currentStageCode', 'initial');
    const [showChoices, setShowChoices] = useState(false);
    const [userChoices, setUserChoices] = usePersistentState('userChoices', []);

    const goBack = () => {
        if (stageNumber === 0) {
            setCurrentStageType('initial');
        } else {
            setStageNumber(stageNumber - 1);
        }
    };

    const goForward = () => {
        if (stageNumber < stages[currentStageType].length - 1)
            setStageNumber(stageNumber + 1);
    }


    const stages = {
        initial: [{
            message: "Hi there! \n What coloring book do you want to create?",
            choices: [
                { id: 'story', label: 'A story', bgColor: 'bg-blue-500', textColor: 'text-white', hoverBgColor: 'bg-blue-400' },
                { id: 'theme', label: 'A theme', bgColor: 'bg-green-500', textColor: 'text-white', hoverBgColor: 'bg-green-400' },
            ],
            onChoice: (choice) => {
                setUserChoices(prevChoices => [...prevChoices, choice.id]);
                setCurrentStageType(choice.id);
            },
        }],
        story: [
            {
                type: 'inputField',
                input_placeholder: 'Enter a character name',
                message: "Choose a character for your story!",
                choices: [
                    { id: 'knight', label: 'A brave knight', bgColor: 'bg-red-500', textColor: 'text-white', hoverBgColor: 'bg-red-400' },
                    { id: 'wizard', label: 'A wise wizard', bgColor: 'bg-blue-500', textColor: 'text-white', hoverBgColor: 'bg-blue-400' },
                    { id: 'rogue', label: 'A cunning rogue', bgColor: 'bg-green-500', textColor: 'text-white', hoverBgColor: 'bg-green-400' },
                ],
                onChoice: (choice) => {
                    setUserChoices(prevChoices => [...prevChoices, choice]);
                    goForward();
                },
            },
            {
                message: "Do you want to add another character or start the story?",
                choices: [
                    { id: 'add_character', label: 'Add another character', bgColor: 'bg-yellow-500', textColor: 'text-white', hoverBgColor: 'bg-yellow-400' },
                    { id: 'start_story', label: 'Start the story', bgColor: 'bg-purple-500', textColor: 'text-white', hoverBgColor: 'bg-purple-400' },
                ],
                onChoice: (choice) => {
                    if (choice.id !== 'add_character') 
                        goForward();
                    setUserChoices(prevChoices => [...prevChoices, choice]);
                },
            },
            {
                type: 'inputField',
                input_placeholder: 'Describe the first scene of your story',
                message: "Let's create the first scene. What's happening with your character(s)?",
                choices: [],
                onChoice: (choice) => {
                    setUserChoices(prevChoices => [...prevChoices, choice]);
                    goForward();
                },
            },
            {
                message: "Here's your scene! What would you like to do?",
                choices: [
                    { id: 'keep_scene', label: 'Keep this scene', bgColor: 'bg-green-500', textColor: 'text-white', hoverBgColor: 'bg-green-400' },
                    { id: 'modify_scene', label: 'Modify the scene', bgColor: 'bg-red-500', textColor: 'text-white', hoverBgColor: 'bg-red-400' },
                    { id: 'regenerate_scene', label: 'Regenerate scene', bgColor: 'bg-blue-500', textColor: 'text-white', hoverBgColor: 'bg-blue-400' },
                ],
                onChoice: (choice) => {
                    if (choice.id === 'modify_scene') {
                        //modify scene

                    } else if (choice.id === 'regenerate_scene') {
                        // logic to regenerate the scene
                        goForward();
                    } else {
                        goForward();
                    }
                },
            },
            {
                message: "Do you want to create another scene or finish your story?",
                choices: [
                    { id: 'create_scene', label: 'Create another scene', bgColor: 'bg-orange-500', textColor: 'text-white', hoverBgColor: 'bg-orange-400' },
                    { id: 'finish_story', label: 'Finish the story', bgColor: 'bg-purple-500', textColor: 'text-white', hoverBgColor: 'bg-purple-400' },
                ],
                onChoice: (choice) => {
                    if (choice.id === 'create_scene') {
                        goForward();
                    }
                },
            },
            {
                message: "Congratulations! You've finished creating your story. Would you like to add a title to your coloring book?",
                type: 'inputField',
                input_placeholder: 'Enter a title for your coloring book',
                choices: [],
                onChoice: (choice) => {
                    setUserChoices(prevChoices => [...prevChoices, choice]);
                    goForward();
                },
            },
        ],
        theme: [
            {
                type: 'inputField',
                input_placeholder: 'Enter a theme name',
                message: "Choose a theme for your coloring book!",
                choices: [
                    // Add theme choices here
                ],
                onChoice: (choice) => {
                    setUserChoices(prevChoices => [...prevChoices, choice]);
                    goForward();
                },
            },
            // Add more theme stages as needed
        ]
    };

    const getCurrentStage = () => {
        const currentStages = stages[currentStageType];
        return currentStages[Math.min(stageNumber, currentStages.length - 1)];
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowChoices(true), 1000);
        return () => clearTimeout(timer);
    }, [stageNumber]);

    const currentStage = getCurrentStage();

    return (
        <div className="w-[95vw] max-w-3xl mx-auto mt-[15vh]">
            <div className="flex items-center mb-6 bg-[#FFF5E6] bg-opacity-75 rounded-lg shadow-lg p-4 font-['Children']">
                <img 
                    src={SKETCHY_MASCOT} 
                    alt="Sketchy Mascot" 
                    className="w-24 h-24 object-contain"
                />
                <div className="flex-grow">
                    <div className="mt-4 text-lg font-semibold">
                        <Message text={currentStage.message} key={stageNumber} />
                    </div>
                </div>
            </div>
            <div className="mt-[10vh] flex flex-col justify-between bg-[#FFF5E6] bg-opacity-75 rounded-lg shadow-lg">
                <div className="flex-grow">
                    {showChoices && (
                        <div>
                            <ChoiceSelector 
                                choices={currentStage.choices}
                                onChoice={(choice) => () => currentStage.onChoice(choice)}
                                onBack={currentStageType === 'initial' ? null : goBack}
                                title={currentStage.title}
                            />
                            {currentStage.type === 'inputField' && (
                                <div className="w-full p-4 flex items-center">
                                    <textarea 
                                        className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out shadow-sm mr-2 resize-none overflow-y-auto"
                                        placeholder={currentStage.input_placeholder}
                                        rows="1"
                                        style={{ minHeight: '48px', maxHeight: '192px' }}
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = `${Math.min(e.target.scrollHeight, 192)}px`;
                                        }}
                                    ></textarea>
                                    <button
                                        onClick={() => {
                                            const inputValue = document.querySelector('textarea').value;
                                            currentStage.onChoice({id: inputValue});
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreationChat;