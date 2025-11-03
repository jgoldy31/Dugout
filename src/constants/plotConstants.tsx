// src/constants/pitchColors.ts
export const pitchColors: Record<string, string> = {
  Sinker: "#f63be3",
  FourSeam: "#f91616",
  Splitter: "#e78c25",
  Slider: "#1b8dc2",
  Cutter: "#bd08ea",
  Default: "#727272",
};

export const pitchColorsDarken: Record<string, string> = {
  Sinker: "#bf01a5",
  FourSeam: "#d60808",
  Splitter: "#f08000",
  Slider: "#0072d6",
  Cutter: "#690282",
  Default: "#727272",
};


export const namesToAbbreviations: Record<string, string> = {
  Sinker: "SI",
  FourSeam: "4S",
  Splitter: "SP",
  Slider: "SL",
  Cutter: "CT",
};

export const LOCATION_X_START = -3;
export const LOCATION_X_END = 3;
export const LOCATION_Y_START = 0;
export const LOCATION_Y_END = 4.5;


export const STRIKE_ZONE = {
  x: -10 / 12,
  y: 1.5,
  width: 20 / 12,
  height: 2,
};