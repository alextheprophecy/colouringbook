import React, { useState, useEffect } from "react";
import ChoiceSelector from "./ChoiceSelector";
import Message from "./Message";
import useGeneratePage from "../../Hooks/CreationChat/useGeneratePage";
import BookCreationModel from '../../Models/BookCreationModel';
import creationOptions from '../../Models/CreationOptionsModel.json';

const CreationChat = () => {
    const SKETCHY_MASCOT = '/assets/textures/sketchy_mascot.png';
    const [currentStageId, setCurrentStageId] = useState('initial_0');
    const [showChoices, setShowChoices] = useState(false);
    
    const [bookCreationModel] = useState(new BookCreationModel());
    const [stageHistory, setStageHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const { imageUrl, generatePage, loading } = useGeneratePage(bookCreationModel);

    const goBack = () => {
        if (stageHistory.length > 0) {
            const previousStageId = stageHistory.pop();
            setStageHistory([...stageHistory]);
            setCurrentStageId(previousStageId);
        }
    };

    const goForward = (nextStageId) => {
        if (nextStageId) {
            setStageHistory([...stageHistory, currentStageId]);
            setCurrentStageId(nextStageId);
        }
    }

    const stages = {
        initial_0: {
            ...creationOptions.initial_0,
            onChoice: (choice) => {
                goForward(choice.nextStageId);
            },
        },
        story_0: {
            ...creationOptions.story_0,
            onChoice: (choice) => {
                if (choice.saveData) {
                    bookCreationModel.addCharacter(choice.saveData.name, choice.saveData.description);
                } else {
                    bookCreationModel.addCharacter("", choice.value);
                }
                bookCreationModel.addUserChoice(choice);
                goForward(choice.nextStageId);
            },
        },
        story_1: {
            ...creationOptions.story_1,
            onChoice: (choice) => {
                bookCreationModel.addUserChoice(choice);
                goForward(choice.nextStageId);
            },
        },
        story_2: {
            ...creationOptions.story_2,
            onChoice: (choice) => {
                bookCreationModel.addScene(choice.value);
                goForward(choice.nextStageId);
            },
        },
        story_3: {
            ...creationOptions.story_3,
            onChoice: (choice) => {
                if (choice.id === 'modify_scene') {
                    // logic to modify or regenerate the scene
                }
                goForward(choice.nextStageId);
            },
        },
        story_4: {
           ...creationOptions.story_4,
            onChoice: (choice) => {
                goForward(choice.nextStageId);
            },
        },
        story_5: {
            ...creationOptions.story_5,   
            onChoice: (choice) => {
                bookCreationModel.addUserChoice(choice);
                // No next stage, end of story
            },
        },
        theme_0: {
            type: 'inputField',
            input_placeholder: 'Enter a theme name',
            message: "Choose a theme for your coloring book!",
            choices: [
                // Add theme choices here
            ],
            onChoice: (choice) => {
                bookCreationModel.addUserChoice(choice);
                // Add logic to go to the next stage if needed
            },
        },
    };

    const getCurrentStage = () => {
        return stages[currentStageId];
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowChoices(true), 1000);
        return () => clearTimeout(timer);
    }, [currentStageId]);


    const currentStage = getCurrentStage();

    return (
        <div className="w-full max-w-3xl mx-auto relative">
            {loading ? (
                <div className="loading-screen flex flex-col items-center justify-center h-screen px-4">
                    <div className="text-3xl sm:text-4xl font-['Children'] mb-4 text-center">
                        Creating...
                    </div>
                    <div className="text-base sm:text-lg font-['Children'] text-center">
                        ... your story about a {bookCreationModel.getCharacters.description} in a {bookCreationModel.getScenes}
                    </div>
                </div>
            ) : (<>
                <div className="fixed top-0 left-0 right-0 pl-[10px] z-[5] bg-[#FFF5E6]  bg-opacity-100 rounded-b-lg shadow-lg">
                    <div className="max-w-3xl mx-auto flex items-center p-4 font-['Children']">
                        <img 
                            src={SKETCHY_MASCOT} 
                            alt="Sketchy Mascot" 
                            className="w-24 h-24 object-contain"
                        />
                        <div className="flex-grow">
                            <div className="text-lg font-semibold">
                                <Message text={currentStage.message} key={currentStageId} />
                            </div>
                        </div>
                    </div>
                    {stageHistory.length > 0 && (
                        <div className="absolute left-6 bottom-0 transform translate-y-1/2">
                            <button
                                onClick={goBack}
                                className="bg-[#1E3A8A] text-white hover:bg-[#1E40AF] active:bg-[#1E4620] transition duration-300 rounded-full p-2 shadow-md h-12 w-12 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-[calc(5vh+6rem)] p-4">
                    {(currentStageId === 'story_3') && (
                        <div className="mb-4 text-center">
                            <button
                                onClick={generatePage}
                                className="bg-[#1E3A8A] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-md">
                                Generate Scene
                            </button>
                        </div>
                    )}
                    {(currentStageId === 'story_3' || currentStageId === 'story_5') && imageUrl && (
                        <div className="mb-4 bg-red-200 p-4 rounded-lg shadow-md text-center">
                            <img src={imageUrl} alt="Generated Scene" className="w-full h-auto" />
                        </div>
                    )}
                    <div className="rounded-lg">
                        {showChoices && (
                            <div>
                                {currentStage.type === 'inputField' && (
                                    <div className="w-[calc(100%-2rem)] mt-4 flex gap-2 mx-auto justify-center items-center">
                                        <div className="flex-grow h-24 relative overflow-hidden rounded-2xl" style={{
                                            backgroundColor: '#FFF5E6',
                                            boxShadow: '4px 6px 15px rgba(0, 0, 0, 0.3)',
                                            border: '3px solid white',
                                        }}>                                        
                                            <textarea 
                                                className="absolute inset-0 w-full h-full bg-transparent text-xl font-bold z-[3] font-['Children'] tracking-wider p-4 resize-none scrollbar-hide placeholder-gray-300"
                                                placeholder="A funny rabbit with&#10;a big hat"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                style={{
                                                    outline: 'none',
                                                    height: '6rem',
                                                    boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.8)',
                                                    color: '#1E3A8A',
                                                }}
                                            ></textarea>
                                            <div className="absolute inset-0 flex items-center justify-end pr-2">
                                                <button
                                                    onClick={() => {
                                                        if (inputValue.trim()){
                                                            currentStage.onChoice({value: inputValue, nextStageId: currentStage.input_nextStageId});
                                                        }
                                                    }}
                                                    className=" z-[4] bg-[#1E3A8A] hover:bg-blue-600 text-white font-bold p-2 rounded-full transition duration-300 ease-in-out shadow-md h-10 w-10 flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <ChoiceSelector 
                                    categoryId={currentStage.categoryId}
                                    onChoice={(choice) => currentStage.onChoice(choice)}
                                    onBack={stageHistory.length > 0 ? goBack : null}
                                    title={currentStage.title}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </>)}
        </div>
    );
};

export default CreationChat;
