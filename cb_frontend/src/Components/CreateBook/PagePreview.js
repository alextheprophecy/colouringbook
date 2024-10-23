import { useSelector, useDispatch } from 'react-redux';
import { setIsEditing } from '../../redux/bookSlice';
import { Wand2, RotateCcw, ChevronRight, Menu } from 'lucide-react'


const PagePreview = ({ onNext, onModifyBook }) => {
    const dispatch = useDispatch();
    const { pages, currentPage } = useSelector(state => state.book);
    const currentPageData = pages[currentPage];

    return (
        <div className="p-4 bg-blue-100 rounded-[15px]">
          <div className="text-center overflow-hidden">
            Here is the preview of the page {currentPage + 1}
            <img src={currentPageData?.image || "https://placehold.co/400x600"} alt="Placeholder" className="rounded-[15px] mx-auto"/>
          </div>
          {/* <div className="mt-4 flex justify-around">
            <button onClick={onModifyBook} className="p-2 bg-red-500 text-white rounded">Modify page</button>
            <button onModifyBook className="p-2 bg-yellow-500 text-white rounded">Reset page</button>
            <button onModifyBook className="p-2 bg-green-500 text-white rounded">Next Page</button>
          </div> */}
           <div className="mt-4 flex justify-between items-center space-x-2">
            <button onClick={onModifyBook} className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-3 rounded-full shadow-md flex-1">
              <Wand2 className="h-7 w-5 flex-shrink-0 mr-1"/> <span className="text-sm">Enhance</span>
            </button>
            <button onClick={() => dispatch(setIsEditing(true))} className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-full shadow-md flex-1">
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
