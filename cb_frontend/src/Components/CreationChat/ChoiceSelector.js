import React, { useMemo } from "react";
import creationOptions from '../../Models/CreationOptionsModel.json';

const ChoiceSelector = ({ categoryId, onChoice, onBack, title }) => {
  const BANNER_DIR = 'assets/images/banners';
  const MAX_OPTIONS = 4;

  const randomOptions = useMemo(() => {
    const category = creationOptions.categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    const options = category.options;

    return category.randomize ? options.sort(() => 0.5 - Math.random()).slice(0, MAX_OPTIONS) : options;
  }, [categoryId]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-4 w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="flex flex-col w-full gap-4">
        {randomOptions.map((option) => (
          <button 
            key={option.id}
            onClick={() => onChoice(option)}
            className="w-full h-24 relative overflow-hidden rounded-2xl"
            style={{
              backgroundImage: option.image ? `url(${BANNER_DIR}${option.image})` : 'none',
              backgroundColor: !option.image ? option.bgColor || 'bg-gray-500' : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '4px 6px 15px rgba(0, 0, 0, 0.3)',
              border: '3px solid white',
            }}
          >
            <div className={`absolute inset-0 bg-[#AEC6CF] ${option.image ? 'opacity-30' : ''}`}></div>
            <div 
              className="absolute inset-0" 
              style={{
                background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
              }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold z-1 text-shadow-lg font-['Children'] tracking-wider">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceSelector;