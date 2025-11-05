import React, { useState } from "react";
import type { ScatterPitch } from "./PitchTypes";
import "./PitchTable.css";

interface PitchTableProps {
  data: ScatterPitch[];
  title?: string;
  rowsPerPage?: number; // optional, default 30
  onSelect?: (pitchUID: string) => void; // callback for selected pitch
}

export default function PitchTable({
  data,
  rowsPerPage = 20,
  onSelect,
}: PitchTableProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleRowClick = (globalIndex: number) => {
    setSelectedIndex(globalIndex);
    if (onSelect) onSelect(data[globalIndex].PitchUID);
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage((prev) =>
    Math.min(prev + 1, totalPages - 1)
  );

  return (
    <div className="pitch-table-container">

      <table className="pitch-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Pitch Type</th>
            <th>Velocity</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((pitch, index) => {
            const globalIndex = currentPage * rowsPerPage + index;
            const isSelected = selectedIndex === globalIndex;
            return (
              <tr
                key={globalIndex}
                className={isSelected ? "selected-row" : ""}
                onClick={() => handleRowClick(globalIndex)}
              >
                <td>{globalIndex + 1}</td>
                <td>{pitch.pitch_type}</td>
                <td>{pitch.start_speed}</td>
                <td>{new Date(pitch.Date).toLocaleDateString()}</td>
                <td>{pitch.Description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrev} disabled={currentPage === 0}>
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}
