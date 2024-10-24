import React from 'react';
import { Wand2, RotateCcw, ChevronRight } from 'lucide-react';
import usePagePreview from '../../Hooks/CreateBook/usePagePreview';
import { useDispatch } from 'react-redux';
import { setIsEditing } from '../../redux/bookSlice';

const PagePreview = ({ onNext}) => {
    const dispatch = useDispatch();
    const { currentPage, currentPageData, handleRegenerate, isLoading } = usePagePreview();

    return (
        <div className="p-4 bg-blue-100 rounded-[15px]">
          <div className="text-center overflow-hidden">
            Here is page {currentPage}
            <img src={currentPageData?.image || "https://placehold.co/400x600"} alt="Placeholder" className="rounded-[15px] mx-auto"/>
          </div>
          <div className="mt-4 flex justify-between items-center space-x-2">
            <button onClick={() => dispatch(setIsEditing(true))} className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-3 rounded-full shadow-md flex-1">
              <Wand2 className="h-7 w-5 flex-shrink-0 mr-1"/> <span className="text-sm">Enhance</span>
            </button>
            <button onClick={handleRegenerate} className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-full shadow-md flex-1" disabled={isLoading}>
              <RotateCcw className="h-7 w-5 flex-shrink-0 mr-1" /> <span className="text-sm">Regenerate</span>
            </button>
            <button onClick={onNext} className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-full shadow-md flex-2">
              <ChevronRight className="h-7 w-5 flex-shrink-0 mr-1" /> <span className="text-sm">Next</span>
            </button>
          </div>
        </div>
    );
};

export default PagePreview;
