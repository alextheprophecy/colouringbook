import { useSelector, useDispatch } from 'react-redux';
import { setIsEditing } from '../../redux/bookSlice';

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
          <div className="mt-4 flex justify-around">
            <button onClick={onModifyBook} className="p-2 bg-red-500 text-white rounded">Modify Book</button>
            <button onClick={() => dispatch(setIsEditing(true))} className="p-2 bg-yellow-500 text-white rounded">Modify Page</button>
            <button onClick={onNext} className="p-2 bg-green-500 text-white rounded">Next Page</button>
          </div>
        </div>
    );
};

export default PagePreview;
