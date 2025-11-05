//Front side release plot
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,

} from "recharts";
import { pitchColors } from "../constants/plotConstants";
interface ReleasePoints {
  [pitchType: string]: [number, number]; 
}

interface PitchPlotProps {
  releasePoints: ReleasePoints;
  width?: number;
  height?: number;
  backgroundImage?: string; 
}


const LargeCircle = (props: any) => {
  const { cx, cy, fill, stroke, strokeWidth } = props;
  return <circle cx={cx} cy={cy} r={7} fill={fill} fillOpacity={0.7} stroke={stroke} strokeWidth={strokeWidth} />;
};
const PitchPlot: React.FC<PitchPlotProps> = ({
  releasePoints,
  width = 400,
  height = 600,
  backgroundImage = "src/images/pitcher_front.png",
}) => {


  
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
          id="bgImage"
          patternUnits="userSpaceOnUse"
          width={width}
          height={height}
        >
          <image
            href={backgroundImage}
            x="110"
            y="-5"
            width={width*.8}
            height={height * .8}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#bgImage)" />

      {/* Axes */}
      <XAxis
        type="number"
        dataKey="x"
        name="X0"
        domain={[-4, 4]}
        hide
      />
      <YAxis
        type="number"
        dataKey="y"
        name="Z0"
        domain={[0, 7]}
        hide
      />



   

      {/* Scatter points */}

      {datasets.map((ds) => (
        <Scatter
  key={ds.pitch}
  name={ds.pitch}
  data={ds.data}
  fill={ds.color}
  fillOpacity={0.7}  
  stroke="#424242ff"       
  strokeWidth={.85}    
  shape={<LargeCircle />}
/>
      ))}
    </ScatterChart>
  );
};

export default PitchPlot;
