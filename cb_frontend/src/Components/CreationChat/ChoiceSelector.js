import React from "react";

const ChoiceSelector = ({ choices, setMode }) => (
  <div className="flex justify-center space-x-4 mt-6">
    {choices.map((choice, index) => (
      <button 
        key={index}
        onClick={() => setMode(choice.mode)}
        className={`px-6 py-3 ${choice.bgColor} ${choice.textColor} font-bold rounded-full hover:${choice.hoverBgColor} transition duration-300 transform hover:scale-105`}
      >
        {choice.label}
      </button>
    ))}
  </div>
);

export default ChoiceSelector;