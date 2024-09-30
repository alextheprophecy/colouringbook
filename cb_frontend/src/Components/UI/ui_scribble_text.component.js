import '../../Styles/UI/scribble_text.css';
import rough from 'roughjs/bundled/rough.esm';
import { useEffect, useRef, useState } from "react";
import opentype from 'opentype.js';

const ScribbleText = ({ text = "Error",
          sizeFactor=1, strokeColor='black', fillColor='black',
                      strokeWidth = 1.75, roughness = 1.5, animate=true}) => {

    const FREQUENCY = 10; // Swapping frequency (times per second)
    const seeds = [1, 2,3,4, 5]; // Pre-defined set of seeds
    const [currentSeedIndex, setCurrentSeedIndex] = useState(0);
    const [font, setFont] = useState(null);
    const svgRef = useRef(null);
    const svgElements = useRef([]); // Store pre-generated SVG elements
    const intervalRef = useRef(null); // Store the interval ID

    // Load the font once when the component mounts
    useEffect(() => {
        opentype.load('/assets/fonts/ChildrenRegular/Children.ttf', (err, loadedFont) => {
            if (err) {
                console.error('Could not load font:', err);
            } else {
                setFont(loadedFont);
            }
        });
    }, []);

    // Generate SVG path data and bounding box
    const generateSVG = (text) => {
        if (!font) return null; // Font not loaded yet

        const fontSize = 100*sizeFactor; // Adjust the font size as needed
        const x = 0;
        const y = fontSize; // y position (font baseline)
        const path = font.getPath(text, x, y, fontSize);
        const pathData = path.toPathData();
        const bbox = path.getBoundingBox();
        return { pathData, bbox };
    };

    // Generate scribbled text with rough.js
    const generateScribbleText = (seed, fillStyle = 'solid') => {
        const roughSvg = rough.svg(svgRef.current);
        const result = generateSVG(text);

        if (!result) return null; // Return if the path is not ready

        const { pathData, bbox } = result;

        const element = roughSvg.path(pathData, {
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            roughness: roughness,
            fill: fillColor,
            fillStyle: fillStyle,
            seed,
        });

        return { element, bbox };
    };

    // Pre-generate all the SVGs and adjust SVG size
    useEffect(() => {
        if (!font) return; // Wait until the font is loaded

        // Clear previous elements
        svgElements.current = [];
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        seeds.forEach((seed) => {
            const result = generateScribbleText(seed);
            if (result) {
                const { element, bbox } = result;
                svgElements.current.push(element);

                // Update bounding box values
                if (bbox.x1 < minX) minX = bbox.x1;
                if (bbox.y1 < minY) minY = bbox.y1;
                if (bbox.x2 > maxX) maxX = bbox.x2;
                if (bbox.y2 > maxY) maxY = bbox.y2;
            }
        });

        const width = maxX - minX;
        const height = maxY - minY;

        // Set the SVG size and viewBox
        svgRef.current.setAttribute('width', width);
        svgRef.current.setAttribute('height', height);
        svgRef.current.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);

        // Clear any existing children
        while (svgRef.current.firstChild) {
            svgRef.current.removeChild(svgRef.current.firstChild);
        }

        // Append the first SVG element
        if (svgElements.current[0]) {
            svgRef.current.appendChild(svgElements.current[0]);
        }

        if(!animate)return


        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Set up the interval to swap between SVG elements
        if (svgElements.current.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentSeedIndex((prevIndex) => (prevIndex + 1) % svgElements.current.length);
            }, 1000 / FREQUENCY); // Update based on frequency
        }

        // Cleanup function to clear the interval
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [font, text]);

    // Update the displayed SVG when currentSeedIndex changes
    useEffect(() => {
        if (svgElements.current.length === 0) return;

        // Clear existing SVG elements
        while (svgRef.current.firstChild) {
            svgRef.current.removeChild(svgRef.current.firstChild);
        }

        // Append the current SVG element
        svgRef.current.appendChild(svgElements.current[currentSeedIndex]);
    }, [currentSeedIndex]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default ScribbleText;
