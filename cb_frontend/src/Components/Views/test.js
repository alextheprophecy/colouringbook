import React, { useRef, useCallback, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';


const PageContent = React.forwardRef((props, ref) => {
  return (
    <div
      className="page bg-white p-4"
      ref={ref}

      //optional
      style={{ pointerEvents: 'none' }} // Prevent the page from capturing pointer events
    >
      <h2 className="text-xl font-bold mb-2">Page {props.number}</h2>
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write something..."
        
        //optional
        style={{ pointerEvents: 'auto', touchAction: 'auto' }} // Allow the textarea to receive pointer and touch events
        
        //optional
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      />
    </div>
  );
});


const TestFlipBook = () => {
    const [isFlipLocked, setIsFlipLocked] = useState(false);
    const flipBookRef = useRef(null);
  
    const getBookInstance = useCallback(() => flipBookRef.current?.pageFlip(), []);
  
    const toggleFlipLock = useCallback(() => {
      setIsFlipLocked((prevState) => !prevState);
      
      // Print the pageFlip() instance to the console
      console.log("PageFlip instance:", flipBookRef.current?.pageFlip());
      
      const book = getBookInstance();
      if (book) {
        book.getSettings().disableFlipByClick = !isFlipLocked;
        console.log("Updated settings:", book.getSettings());
      }
    }, [isFlipLocked, getBookInstance]);
  
    useEffect(() => {
      const book = getBookInstance();
      if (book) {
        book.getSettings().disableFlipByClick = isFlipLocked;
      }
    }, [isFlipLocked, getBookInstance]);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <button
          onClick={toggleFlipLock}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isFlipLocked ? 'Unlock Flip' : 'Lock Flip'}
        </button>
        <HTMLFlipBook
          width={300}
          height={400}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          clickEventForward={false}
          disableFlipByClick={true}
          useMouseEvents={false}
          mobileScrollSupport={true}
          manualPageSlide={false} // Disable manual page slide
          swipeDistance={1000}    // Set a high swipe distance
          ref={flipBookRef}
        >
          <PageContent number="1" />
          <PageContent number="2" />
        </HTMLFlipBook>
      </div>
    );
  };
  
  export default TestFlipBook;
