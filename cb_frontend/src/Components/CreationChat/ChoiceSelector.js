import React from "react";

const ChoiceSelector = ({ choices, onChoice, onBack, title}) => (
  <div className="relative flex flex-wrap items-center justify-center gap-4 p-4">
    {onBack && (
      <button
        onClick={onBack}
        className="absolute left-[6px] top-1/2 transform -translate-y-1/2 bg-[#FF9999] text-gray-600 hover:bg-[#FF6666] active:bg-[#FF3333] transition duration-300 rounded-full p-2 shadow-md"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" stroke="white" />
        </svg>
      </button>
    )}
    {title && <h2 className="text-2xl font-bold">{title}</h2>}
    {choices.map((choice, index) => (
      <button 
        key={index}
        onClick={onChoice(choice)}
        className={`px-5 py-3 ${choice.bgColor} ${choice.textColor} font-bold rounded-full hover:${choice.hoverBgColor} transition duration-300 transform hover:scale-105`}
      >
        {choice.label}
      </button>
    ))}
  </div>
);

export default ChoiceSelector;