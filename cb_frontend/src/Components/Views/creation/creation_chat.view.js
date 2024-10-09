import React, { useState, useEffect } from "react";
import "../../Styles/Views/creation_chat.css";

const CreationChat = () => {
    const SKETCHY_PUBLIC_PATH = "/assets/textures/sketchy_mascot.png"; // Update the path if needed
    const [step, setStep] = useState(1);
    const [theme, setTheme] = useState(null);
    const [character, setCharacter] = useState(null);
    const [action, setAction] = useState(null);
    const [waitingForImage, setWaitingForImage] = useState(false);
    const [displayedMessage, setDisplayedMessage] = useState("");
    const [isTyping, setIsTyping] = useState(true); // State to track typing effect

    const fullMessages = {
        1: "Hi there! Let’s start by choosing a theme for your coloring book.",
        2: "Great choice! Now, let’s pick a character. Who should we put in your story?",
        3: `Excellent! What should your ${character} be doing?`,
        4: `Ta-da! Your ${character} is ${action}! If you like it, we can add another page or finish up.`,
        5: "Your coloring book is ready! Download it or share it with your friends!",
        loading: "I'm drawing your scene! This will just take a moment..."
    };

    useEffect(() => {
        // Typing effect function to display the message letter by letter
        setDisplayedMessage("");
        setIsTyping(true);
        const message = waitingForImage ? fullMessages.loading : fullMessages[step];
        let index = 0;
        const interval = setInterval(() => {
            if (index < message.length) {
                setDisplayedMessage((prev) => prev + message[index]);
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false); // Typing has finished
            }
        }, 50); // Adjust speed by changing the interval time
        return () => clearInterval(interval);
    }, [step, waitingForImage]);

    const nextStep = () => setStep(step + 1);

    const resetCreation = () => {
        setStep(1);
        setTheme(null);
        setCharacter(null);
        setAction(null);
        setWaitingForImage(false);
    };

    const handleThemeSelection = (selectedTheme) => {
        setTheme(selectedTheme);
        nextStep();
    };

    const handleCharacterSelection = (selectedCharacter) => {
        setCharacter(selectedCharacter);
        nextStep();
    };

    const handleActionSelection = (selectedAction) => {
        setAction(selectedAction);
        nextStep();
        setWaitingForImage(true);
        // Simulate image generation delay
        setTimeout(() => {
            setWaitingForImage(false);
        }, 5000); // Simulate a 5-second delay for image generation
    };

    const renderButtons = () => {
        switch (step) {
            case 1:
                return (
                    <div className="options">
                        <button onClick={() => handleThemeSelection("Animals")}>Animals</button>
                        <button onClick={() => handleThemeSelection("Superheroes")}>Superheroes</button>
                        <button onClick={() => handleThemeSelection("Fantasy Adventures")}>Fantasy Adventures</button>
                    </div>
                );
            case 2:
                return (
                    <div className="options">
                        <button onClick={() => handleCharacterSelection("Lion")}>Lion</button>
                        <button onClick={() => handleCharacterSelection("Robot")}>Robot</button>
                        <button onClick={() => handleCharacterSelection("Fairy")}>Fairy</button>
                    </div>
                );
            case 3:
                return (
                    <div className="options">
                        <button onClick={() => handleActionSelection("Dancing")}>Dancing</button>
                        <button onClick={() => handleActionSelection("Eating Pizza")}>Eating Pizza</button>
                        <button onClick={() => handleActionSelection("Fighting Bad Guys")}>Fighting Bad Guys</button>
                    </div>
                );
            case 4:
                return (
                    <div className="options">
                        <button onClick={resetCreation}>Create Another Page</button>
                        <button onClick={() => setStep(5)}>Finish My Book</button>
                    </div>
                );
            case 5:
                return (
                    <div className="options">
                        <button onClick={() => alert("Downloading your book...")}>Download PDF</button>
                        <button onClick={resetCreation}>Start Over</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="creation-chat-container">
            <h1>Creation Chat</h1>
            <div className="mascot-chat">
                <img src={SKETCHY_PUBLIC_PATH} alt="Sketchy Mascot" className="sketchy-icon" />
                <p>{displayedMessage}</p>
            </div>
            {!isTyping && !waitingForImage && renderButtons()} {/* Only show buttons after typing is complete */}
        </div>
    );
};

export default CreationChat;
