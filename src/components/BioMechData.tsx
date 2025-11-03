// src/components/BiomechTable.tsx
import { useBiomechData } from "../hooks/biomechHooks.ts";

export default function BiomechTable() {
  const {
    data,
    pitcherId,
    setPitcherId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    pitcherIds,
    dates,
  } = useBiomechData();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pitch Biomech Data</h2>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div>
          <label className="block text-sm mb-1">Pitcher ID</label>
          <select
            value={pitcherId ?? ""}
            onChange={(e) => setPitcherId(e.target.value || undefined)}
            className="border rounded p-1"
          >
            <option value="">All</option>
            {pitcherIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            value={startDate ?? ""}
            onChange={(e) => setStartDate(e.target.value || undefined)}
            className="border rounded p-1"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            value={endDate ?? ""}
            onChange={(e) => setEndDate(e.target.value || undefined)}
            className="border rounded p-1"
          />
        </div>
      </div>

      <div className="overflow-x-auto max-h-[70vh] border rounded">
        <table className="border-collapse w-full text-xs">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((col) => (
                  <th key={col} className="border p-2 text-left">
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border p-2">
                    {val !== null ? String(val) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
