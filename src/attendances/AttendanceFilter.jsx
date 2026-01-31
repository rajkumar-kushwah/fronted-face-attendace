import { useState } from "react";

export default function AttendanceFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: ""
  });

  const [statusOpen, setStatusOpen] = useState(false); // dropdown open/close

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilter = () => {
    onFilter(filters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 flex-wrap items-end">

      {/* From Date */}
      <div>
        <label className="text-xs">From Date</label>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
          className="border px-2 py-1 rounded text-xs"
        />
      </div>

      {/* To Date */}
      <div>
        <label className="text-xs">To Date</label>
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          className="border px-2 py-1 rounded text-xs"
        />
      </div>

      {/* Status Dropdown */}
      <div className="relative flex gap-2">
        <label className="text-xs">Status</label>
        <div
          className="border px-3 py-1 gap-2 rounded text-xs flex justify-between items-center cursor-pointer"
          onClick={() => setStatusOpen(!statusOpen)}
        >
          <span>{filters.status || "All"}</span>
          <i
            className={`fa fa-caret-down transition-transform duration-200 ${
              statusOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          ></i>
        </div>

        {statusOpen && (
          <ul className="absolute left-0 right-0 bg-white border mt-1 rounded shadow z-10 text-xs">
            {["", "PRESENT", "HALF", "ABSENT"].map((status) => (
              <li
                key={status}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, status });
                  setStatusOpen(false);
                }}
              >
                {status || "All"}
              </li>
            ))}
          </ul>
        )}
        {/* Apply Button */}
      <button
        onClick={applyFilter}
        className="bg-blue-600 text-white px-4 py-1 rounded text-xs"
      >
        Apply
      </button>
      </div>

      
    </div>
  );
}
