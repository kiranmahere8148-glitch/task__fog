import React, { useState, useEffect, useMemo } from 'react';
import './WaveGrid.css';

// --- Configuration ---
// You can easily change these values to see how the grid behaves
const ROWS = 15;
const COLS = 20;
const WAVE_SPEED_MS = 90; // Time in ms for the wave to advance one column
const WAVE_WIDTH = 5;     // The width of the wave's gradient tail

// An array of HSL (Hue, Saturation) values for the wave's color cycles
const WAVE_COLORS = [
  { h: 120, s: 100 }, // Green
  { h: 180, s: 100 }, // Cyan
  { h: 240, s: 100 }, // Blue
  { h: 280, s: 90 },  // Purple
  { h: 320, s: 100 }, // Magenta
];

const WaveGrid = () => {
  // State for the wave's leading column (waveHead) and the current color
  const [waveHead, setWaveHead] = useState(-WAVE_WIDTH);
  const [colorIndex, setColorIndex] = useState(0);

  // The main animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHead(prevHead => {
        if (prevHead > COLS) {
          setColorIndex(prevIndex => (prevIndex + 1) % WAVE_COLORS.length);
          return -WAVE_WIDTH;
        }
        return prevHead + 1;
      });
    }, WAVE_SPEED_MS);

    return () => clearInterval(interval);
  }, []);

  // Memoize the grid cells
  const gridCells = useMemo(() => {
    return Array.from({ length: ROWS * COLS }).map((_, index) => {
      const col = index % COLS;
      const baseColor = WAVE_COLORS[colorIndex];
      const distance = waveHead - col;

      let backgroundColor = 'transparent';

      if (distance >= 0 && distance < WAVE_WIDTH) {
        const lightness = 50 - distance * 10;
        backgroundColor = `hsl(${baseColor.h}, ${baseColor.s}%, ${lightness}%)`; // ✅ fixed
      }
      
      return (
        <div
          key={index}
          className="grid-cell"
          style={{ backgroundColor }}
        />
      );
    });
  }, [waveHead, colorIndex]);

  return (
    <div
      className="grid-container"
      style={{
        '--rows': ROWS,
        '--cols': COLS,
      }}
    >
      {gridCells}
    </div>
  );
};

export default WaveGrid;
