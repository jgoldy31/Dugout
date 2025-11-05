// Pitch heatmap with Gausiasian KDE
import React, { useEffect, useRef, useState } from "react";
import { STRIKE_ZONE } from "../constants/plotConstants";
import {
  LOCATION_X_START,
  LOCATION_X_END,
  LOCATION_Y_START,
  LOCATION_Y_END,
} from "../constants/plotConstants";
import home_plate from "../images/home_plate.png";

interface Pitch {
  x: number;
  y: number;
}

interface PitchHeatmapProps {
  pitches: Pitch[];
  sigma?: number; 
  gridSize?: number;
  maxColor?: string;
}


const plateImg = new Image();
plateImg.src = home_plate;

export default function PitchHeatmap({
  pitches,
  sigma = 0.3,
  gridSize = 200,
  maxColor = "#FF0000",
}: PitchHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 370, height: 550 });


  useEffect(() => {
    const aspectRatio =
      (LOCATION_Y_END - LOCATION_Y_START) /
      (LOCATION_X_END - LOCATION_X_START);

    const resize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        const width = clientWidth || 370;
        const height = width * aspectRatio;
        setSize({ width, height });
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const { width, height } = size;
    if (width <= 0 || height <= 0) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;


    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

 
    const xRange = LOCATION_X_END - LOCATION_X_START;
    const yRange = LOCATION_Y_END - LOCATION_Y_START;
    const aspect = yRange / xRange;


    const gridSizeX = gridSize;
    const gridSizeY = Math.round(gridSize * aspect);

    const grid: number[][] = Array.from({ length: gridSizeY }, () =>
      Array(gridSizeX).fill(0)
    );

    const xStep = xRange / gridSizeX;
    const yStep = yRange / gridSizeY;

    //Gausian
    const sigmaX = sigma * xRange;
    const sigmaY = sigma * yRange;

    const gaussian = (dx: number, dy: number) =>
      Math.exp(
        -((dx * dx) / (2 * sigmaX * sigmaX) + (dy * dy) / (2 * sigmaY * sigmaY))
      );

    //KDE
    for (const p of pitches) {
      for (let i = 0; i < gridSizeX; i++) {
        const x = LOCATION_X_START + i * xStep;
        for (let j = 0; j < gridSizeY; j++) {
          const y = LOCATION_Y_START + j * yStep;
          grid[j][i] += gaussian(p.x - x, p.y - y);
        }
      }
    }

   
    let maxVal = 0;
    for (const row of grid)
      for (const val of row) if (val > maxVal) maxVal = val;

    //Assign Hex Value based on Max color
    const hexToRgb = (hex: string) => {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c.split("").map((x) => x + x).join("");
      const num = parseInt(c, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    };
    const [maxR, maxG, maxB] = hexToRgb(maxColor);

  
    const imgData = ctx.createImageData(width, height);
    const scaleX = gridSizeX / width;
    const scaleY = gridSizeY / height;

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        const gx = px * scaleX;
        const gy = py * scaleY;

        const x0 = Math.floor(gx);
        const y0 = Math.floor(gy);
        const x1 = Math.min(x0 + 1, gridSizeX - 1);
        const y1 = Math.min(y0 + 1, gridSizeY - 1);

        const dx = gx - x0;
        const dy = gy - y0;

        const val =
          grid[y0][x0] * (1 - dx) * (1 - dy) +
          grid[y0][x1] * dx * (1 - dy) +
          grid[y1][x0] * (1 - dx) * dy +
          grid[y1][x1] * dx * dy;

        const norm = val / maxVal;
        const t = Math.min(Math.max((norm - 0.2) / (0.5 - 0.1), 0), 1);

        const r = Math.floor(255 + (maxR - 255) * t);
        const g = Math.floor(255 + (maxG - 255) * t);
        const b = Math.floor(255 + (maxB - 255) * t);
        const alpha = Math.min(1, norm);

        const idx = (py * width + px) * 4;
        imgData.data[idx] = r;
        imgData.data[idx + 1] = g;
        imgData.data[idx + 2] = b;
        imgData.data[idx + 3] = Math.floor(alpha * 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    //Add strike zone and plate image
    const sx =
      ((STRIKE_ZONE.x - LOCATION_X_START) / xRange) * width;
    const sy =
      height -
      ((STRIKE_ZONE.y + STRIKE_ZONE.height - LOCATION_Y_START) /
        yRange) *
        height;
    const sw = (STRIKE_ZONE.width / xRange) * width;
    const sh = (STRIKE_ZONE.height / yRange) * height;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(sx, sy, sw, sh);

    // --- Draw home plate ---
    const drawPlate = () => {
      const aspect = plateImg.height / plateImg.width;
      const plateWidth = sw * 1.5;
      const plateHeight = plateWidth * aspect;
      const centerX = width / 2 - plateWidth / 2;
      const bottomY = height - plateHeight;
      ctx.drawImage(plateImg, centerX, bottomY, plateWidth, plateHeight);
    };

    if (plateImg.complete) drawPlate();
    else plateImg.onload = drawPlate;
  }, [pitches, size, sigma, gridSize, maxColor]);

  return (
    <div ref={containerRef} style={{ width: "80%", height: "80%", marginLeft: "10%" }}>
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{ display: "block" }}
      />
    </div>
  );
}
