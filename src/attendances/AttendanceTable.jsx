import React from "react";

export default function AttendanceTable({ data }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[900px] w-full text-center text-xs md:text-xs border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1">Code</th>
            <th className="px-2 py-1">Employee</th>
            <th className="px-2 py-1">Date</th>
            <th className="px-2 py-1">In Time</th>
            <th className="px-2 py-1">Out Time</th>
            <th className="px-2 py-1">Status</th>
            <th className="px-2 py-1">Late</th>
            <th className="px-2 py-1">Early</th>
            <th className="px-2 py-1">Working</th>
            <th className="px-2 py-1">In Location</th>
            <th className="px-2 py-1">Out Location</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row._id}
              className="hover:bg-gray-50 border-b border-gray-200"
            >
              {/* Employee Code */}
              <td className="px-2 py-1">{row.employeeCode}</td>

              {/* Employee Name + Photo */}
              <td className="px-2 py-1 flex items-center gap-2 justify-center">
                {row.faceImage ? (
                  <img
                    src={row.faceImage}
                    alt={row.employeeName}
                    className="w-6 h-6 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                )}
                <span className="whitespace-nowrap">{row.employeeName}</span>
              </td>

              {/* Date */}
              <td className="px-2 py-1 whitespace-nowrap">
                {row.date
                  ? new Date(row.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "-"}
              </td>

              {/* In Time */}
              <td className="px-2 py-1 whitespace-nowrap">
                {row.inTime
                  ? new Date(row.inTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "-"}
              </td>

              {/* Out Time */}
              <td className="px-2 py-1 whitespace-nowrap">
                {row.outTime
                  ? new Date(row.outTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "-"}
              </td>

              {/* Status */}
              <td
                className={`px-2 py-1 font-semibold whitespace-nowrap ${row.status === "PRESENT"
                    ? "text-green-600"
                    : row.status === "HALF"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
              >
                {row.status}
              </td>

              {/* Late, Early, Working */}
              <td className="px-2 py-1">{row.lateMinutes ?? 0}</td>
              <td className="px-2 py-1">{row.earlyMinutes ?? 0}</td>
              <td className="px-2 py-1">{row.workingMinutes ?? 0}</td>

              {/* Locations */}
              <td className="px-2 py-1">{row.inLocation?.address ??  "-"}</td>
              <td className="px-2 py-1">{row.outLocation?.address ?? "-"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
