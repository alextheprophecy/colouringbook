import { useState } from "react";

const usePageGeneration = () => {
  const [pages, setPages] = useState([]);

  const generatePage = (input) => {
    // Placeholder for page generation logic
    setPages([...pages, input]);
  };

  return { pages, generatePage };
};

export default usePageGeneration;