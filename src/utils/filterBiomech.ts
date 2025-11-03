// src/utils/filterBiomechData.ts
export type CountOption = "All" | "Ahead" | "Behind" | "Even" | "0-0" | "2K" | "3-2";
export type HandednessOption = "All" | "vL" | "vR";

interface BiomechRecord {
  pitcher_id: string;
  Date: string; // e.g. "2025-03-18"
  count?: CountOption;       // match your CountButton options
  handedness?: HandednessOption; // match your HandednessButton options
  [key: string]: any;
}

interface FilterOptions {
  pitcherId?: string;
  startDate?: string;
  endDate?: string;
  count?: CountOption;
  handedness?: HandednessOption;
}

export function filterBiomechData(
  data: BiomechRecord[],
  filters: FilterOptions
): BiomechRecord[] {
  const { pitcherId, startDate, endDate, count, handedness } = filters;

  return data.filter((row) => {

    // Pitcher filter
    const matchPitcher = pitcherId ? row.pitcher_id === pitcherId : true;

    // Date filter
    const rowDate = new Date(row.Date);
    const afterStart = startDate ? rowDate >= new Date(startDate) : true;
    const beforeEnd = endDate ? rowDate <= new Date(endDate) : true;

    // Count filter
    const behindCounts = [ "1-0", "2-0", "3-0", "3-1", ];
    const aheadCounts = ["0-1", "0-2", "1-2", "1-1","2-2",];
    const evenCounts = ["0-0", "3-2", "2-1"]; 
    const three_two = "3-2";
    const zero_zero = "0-0";
    const two_k = ["0-2", "1-2", "2-2"];
    

    const currentCount = String(row.balls) + "-" + String(row.strikes);
    if (count && count !== "All") {
      if (count === "Behind") {
        if (!behindCounts.includes(currentCount || "")) return false;
      } else if (count === "Ahead") {
        if (!aheadCounts.includes(currentCount || "")) return false;
      } else if (count === "Even") {
        if (!evenCounts.includes(currentCount|| "")) return false;
      } else if (count === three_two) {
        if (currentCount !== three_two) return false;
      } else if (count === zero_zero) {
        if (currentCount !== zero_zero) return false;
      } else if (count === "2K") {
        if (!two_k.includes(currentCount || "")) return false;
      }
    }

    const currHandedness = row.batterSide;
    if (handedness && handedness !== "All") {
      if (handedness === "vL") {
        if (currHandedness !== "L") return false;
      } else if (handedness === "vR") {
        if (currHandedness !== "R") return false;
      }
    }

    return matchPitcher && afterStart && beforeEnd ;
  });
}
