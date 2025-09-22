import React, { useState, useEffect, useMemo } from 'react';

// --- Configuration ---
// These values can be easily changed to customize the grid's behavior
const ROWS = 15;
const COLS = 20;
const WAVE_SPEED_MS = 90; // Time in ms for the wave to advance one column
const WAVE_WIDTH = 5;     // The width of the wave's gradient tail

// An array of HSL (Hue, Saturation) values for the wave's color cycles
const WAVE_COLORS = [
  { h: 120, s: 100 }, // Green
  { h: 180, s: 100 }, // Cyan
  { h: 240, s: 100 }, // Blue
  { h: 280, s: 90 }, // Purple
  { h: 320, s: 100 }, // Magenta
];

// The main App component that contains all the logic and styling
const App = () => {
  // State for the wave's leading column (waveHead)
  const [waveHead, setWaveHead] = useState(-WAVE_WIDTH);
  // State for the current color in the cycle
  const [colorIndex, setColorIndex] = useState(0);
  // New state to track the wave's direction: 1 for right, -1 for left
  const [direction, setDirection] = useState(1);

  // The main animation loop, using a single interval for all state updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHead(prevHead => {
        let newHead = prevHead + direction;
        
        // Check if the wave has hit the right boundary
        if (direction === 1 && newHead > COLS + WAVE_WIDTH) {
          // Change direction to left and advance the color cycle
          setDirection(-1);
          setColorIndex(prevIndex => (prevIndex + 1) % WAVE_COLORS.length);
          // Return the new head position to start the reverse movement
          return COLS + WAVE_WIDTH;
        }

        // Check if the wave has hit the left boundary
        if (direction === -1 && newHead < -WAVE_WIDTH) {
          // Change direction to right and advance the color cycle
          setDirection(1);
          setColorIndex(prevIndex => (prevIndex + 1) % WAVE_COLORS.length);
          // Return the new head position to start the forward movement
          return -WAVE_WIDTH;
        }

        // Normal movement
        return newHead;
      });
    }, WAVE_SPEED_MS);

    return () => clearInterval(interval);
  }, [direction, colorIndex]);

  // Memoize the grid cells to optimize performance
  const gridCells = useMemo(() => {
    return Array.from({ length: ROWS * COLS }).map((_, index) => {
      const col = index % COLS;
      const baseColor = WAVE_COLORS[colorIndex];
      // Calculate distance based on current direction
      const distance = direction === 1 ? waveHead - col : col - waveHead;

      let backgroundColor = 'transparent';

      if (distance >= 0 && distance < WAVE_WIDTH) {
        // Calculate the lightness for the gradient effect
        const lightness = 50 - distance * 10;
        backgroundColor = `hsl(${baseColor.h}, ${baseColor.s}%, ${lightness}%)`;
      }
      
      return (
        <div
          key={index}
          className="grid-cell"
          style={{ backgroundColor }}
        />
      );
    });
  }, [waveHead, colorIndex, direction]);

  return (
    // All CSS is now in the style block for a single-file React app
    <>
      <style>{`
        body {
          margin: 0;
          display: flex;
          place-items: center;
          min-width: 320px;
          min-height: 100vh;
          background-color: #242424; /* Background color from original root */
          color: rgba(255, 255, 255, 0.87);
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        }

        /* Styles for the overall grid container */
        .grid-container {
          display: grid;
          /* Use CSS variables for a dynamic grid */
          grid-template-columns: repeat(var(--cols), 1fr);
          grid-template-rows: repeat(var(--rows), 1fr);
          
          /* Make the grid responsive */
          width: 80vw;
          max-width: 900px;
          aspect-ratio: var(--cols) / var(--rows);

          background-color: #000; /* Black background for the gaps */
          border: 1px solid #333;
          border-radius: 8px; /* Added for a modern look */
          overflow: hidden; /* Ensures cells stay within the container */
          gap: 1px;
          padding: 1px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        /* Styles for individual grid cells */
        .grid-cell {
          background-color: transparent; /* Default state is transparent */
          width: 100%;
          height: 100%;
          /* Adds a subtle fade effect when colors change */
          transition: background-color 0.1s ease-in-out;
        }
      `}</style>
      <div
        className="grid-container"
        style={{
          '--rows': ROWS,
          '--cols': COLS,
        }}
      >
        {gridCells}
      </div>
    </>
  );
};

export default App;