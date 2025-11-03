// src/hooks/useBiomechData.ts
import { useState, useMemo } from "react";
import biomechDataRaw from "../data/pitch_biomech_data.json";
import type { CountOption, HandednessOption } from "../utils/filterBiomech";
import { filterBiomechData } from "../utils/filterBiomech";

interface BiomechRecord {
  pitcher_id: string;
  Date: string;
  count?: CountOption;
  handedness?: HandednessOption;
  [key: string]: any;
}

const biomechData = biomechDataRaw as BiomechRecord[];

export function useBiomechData() {
  // Filters
  const [pitcherId, setPitcherId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [selectedCount, setSelectedCount] = useState<CountOption>("All");
  const [selectedHandedness, setSelectedHandedness] = useState<HandednessOption>("All");

  // Filtered data
  const filteredData = useMemo(() => {
    return filterBiomechData(biomechData, {
      pitcherId,
      startDate,
      endDate,
      count: selectedCount,
      handedness: selectedHandedness,
    });
  }, [pitcherId, startDate, endDate, selectedCount, selectedHandedness]);

  const pitcherIds = Array.from(new Set(biomechData.map((d) => d.pitcher_id)));
  const dates = Array.from(new Set(biomechData.map((d) => d.Date))).sort();

  return {
    data: filteredData,
    pitcherId,
    setPitcherId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedCount,
    setSelectedCount,
    selectedHandedness,
    setSelectedHandedness,
    pitcherIds,
    dates,
  };
}
