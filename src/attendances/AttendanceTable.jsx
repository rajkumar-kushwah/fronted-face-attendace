import React from "react";


export default function AttendanceTable({data, handleDelete}) {
  
  
  return (
    <div className="overflow-x-auto border border-gray-300 w-full">
      <table className="min-w-[900px] w-full text-center text-xs md:text-xs border border-gray-200">
        <thead className="bg-gray-100 border border-r border-gray-300">
          <tr>
            <th className="px-2 py-1 border-r border-gray-300">Code</th>
            <th className="px-2 py-1 border-r border-gray-300">Employee</th>
            <th className="px-2 py-1 border-r border-gray-300">Date</th>
            <th className="px-2 py-1 border-r border-gray-300">In Time</th>
            <th className="px-2 py-1 border-r border-gray-300">Out Time</th>
            <th className="px-2 py-1 border-r border-gray-300">Status</th>
            <th className="px-2 py-1 border-r border-gray-300">Late</th>
            <th className="px-2 py-1 border-r border-gray-300">Early</th>
            <th className="px-2 py-1 border-r border-gray-300">Working</th>
            <th className="px-2 py-1 border-r border-gray-300">In Location</th>
            <th className="px-2 py-1 border-r border-gray-300">Out Location</th>
            <th className="px-2 py-1 border-r border-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row._id}
              className="hover:bg-gray-50 border border-r border-gray-200"
            >
              {/* Employee Code */}
              <td className="px-2 py-1 border-r border-gray-300">{row.employeeCode}</td>

              {/* Employee Name + Photo */}
              <td className="px-2 py-1 flex items-center gap-2 justify-center border-r border-gray-300">
                {row.faceImage ? (
                  <img
                    src={row.faceImage}
                    alt={row.employeeName}
                    className="w-6 h-6 rounded-full object-cover border "
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 "></div>
                )}
                <span className="whitespace-nowrap ">{row.employeeName}</span>
              </td>

              {/* Date */}
              <td className="px-2 py-1 whitespace-nowrap border-r border-gray-300">
                {row.date
                  ? new Date(row.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "-"}
              </td>

              {/* In Time */}
              <td className="px-2 py-1 whitespace-nowrap border-r border-gray-300">
                {row.inTime
                  ? new Date(row.inTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "-"}
              </td>

              {/* Out Time */}
              <td className="px-2 py-1 whitespace-nowrap border-r border-gray-300">
                {row.outTime
                  ? new Date(row.outTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "-"}
              </td>

              {/* Status */}
              <td
                className={`px-2 py-1 font-semibold whitespace-nowrap border-r border-gray-300 ${row.status === "PRESENT"
                    ? "text-green-600"
                    : row.status === "HALF"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
              >
                {row.status}
              </td>

              {/* Late, Early, Working */}
              <td className="px-2 py-1 border-r border-gray-300">{row.lateMinutes ?? 0}</td>
              <td className="px-2 py-1 border-r border-gray-300">{row.earlyMinutes ?? 0}</td>
              <td className="px-2 py-1 border-r border-gray-300">{row.workingMinutes ?? 0}</td>

              {/* Locations */}
              <td className="px-2 py-1 border-r border-gray-300">{row.inLocation?.address ??  "-"}</td>
              <td className="px-2 py-1 border-r border-gray-300">{row.outLocation?.address ?? "-"}</td>
                  <td className="px-2 py-1 border-r border-gray-300">
                  <button
                  className="bg-red-500 text-white cursor-pointer px-2 py-1 rounded-md"
                  onClick={() => handleDelete(row.employeeId, new Date(row.date).toISOString().split('t')[0])}
                  >Delete</button>
                  </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
