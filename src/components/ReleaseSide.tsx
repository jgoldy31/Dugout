//Side release plot
import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis } from "recharts";
import { pitchColors } from "../constants/plotConstants";

interface ReleasePoints {
  [pitchType: string]: [number, number]; 
}

interface PitchPlotPropsSide {
  releasePoints: ReleasePoints;
  width?: number;
  height?: number;
  backgroundImage?: string; 
}

const LargeCircle = (props: any) => {
  const { cx, cy, fill, stroke, strokeWidth } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={fill}
      fillOpacity={0.7}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

const PitchPlotSide: React.FC<PitchPlotPropsSide> = ({
  releasePoints,
  width = 600,
  height = 400,
  backgroundImage = "src/images/pitcher_side.png",
}) => {
  //Unique pattern ID to avoid conflicts
  const patternId = `bgImageSide-${Math.random().toString(36).substr(2, 5)}`;

 
  const datasets = Object.entries(releasePoints).map(([pitch, [x, y]]) => ({
    pitch,
    data: [{ x, y }],
    color: pitchColors[pitch] || "black",
  }));

  return (
    <ScatterChart
      width={width}
      height={height}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {/* Background image */}
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={width}
          height={height}
        >
          <image
            href={backgroundImage}
            x="80"
            y="80"
            width={width * 0.8}
            height={height * 0.8}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${patternId})`} />

      {/* Axes */}
      <XAxis type="number" dataKey="x" name="X0" domain={[10, 13]} hide reversed/>
      <YAxis type="number" dataKey="y" name="Extension" domain={[5, 7]} hide />

      {/* Scatter points */}
      {datasets.map((ds) => (
        <Scatter
          key={ds.pitch}
          name={ds.pitch}
          data={ds.data}
          fill={ds.color}
          fillOpacity={0.7}
          stroke="#424242ff"
          strokeWidth={0.85}
          shape={<LargeCircle />}
        />
      ))}
    </ScatterChart>
  );
};

export default PitchPlotSide;
