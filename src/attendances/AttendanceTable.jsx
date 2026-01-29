import { useEffect, useState } from "react";
import { getTodayAttendanceApi } from "../utils/api";
import Layout from "../components/Layout";

export default function AttendanceTable() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getTodayAttendanceApi("6972164941d0a468448c5f2c");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center">Today's Attendance</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs">Code</th>
              <th className="px-3 py-2 text-left text-xs">Employee</th>
              <th className="px-3 py-2 text-left text-xs">In Time</th>
              <th className="px-3 py-2 text-left text-xs">Out Time</th>
              <th className="px-3 py-2 text-left text-xs">Status</th>
              <th className="px-3 py-2 text-left text-xs">Late (min)</th>
              <th className="px-3 py-2 text-left text-xs">Early (min)</th>
              <th className="px-3 py-2 text-left text-xs">Working (min)</th>
              <th className="px-3 py-2 text-left text-xs">In Location</th>
              <th className="px-3 py-2 text-left text-xs">Out Location</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {data.map(row => (
              <tr key={row._id} className="hover:bg-gray-50 border-b">

                {/* Employee Code */}
                <td className="px-3 py-2 text-xs font-medium text-gray-700">{row.employeeCode}</td>

                {/* Employee Name + Photo */}
                <td className="px-3 py-2 flex items-center space-x-2 text-xs">
                  {row.faceImage ? (
                    <img
                      src={row.faceImage}
                      alt={row.employeeName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  )}
                  <span className="font-semibold text-gray-800">{row.employeeName}</span>
                </td>

                {/* In Time */}
                <td className="px-3 py-2 text-xs text-gray-700">
                  {row.inTime ? new Date(row.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                </td>

                {/* Out Time */}
                <td className="px-3 py-2 text-xs text-gray-700">
                  {row.outTime ? new Date(row.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                </td>

                {/* Status */}
                <td className={`px-3 py-2 text-xs font-semibold ${
                  row.status === "PRESENT" ? "text-green-600" :
                  row.status === "HALF" ? "text-yellow-500" :
                  "text-red-500"
                }`}>
                  {row.status}
                </td>

                {/* Late Minutes */}
                <td className="px-3 py-2 text-xs text-gray-700">{row.lateMinutes ?? 0}</td>

                {/* Early Minutes */}
                <td className="px-3 py-2 text-xs text-gray-700">{row.earlyMinutes ?? 0}</td>

                {/* Working Minutes */}
                <td className="px-3 py-2 text-xs text-gray-700">{row.workingMinutes ?? 0}</td>

                {/* In Location */}
                <td className="px-3 py-2 text-xs text-gray-700">{row.inLocation ?? "-"}</td>

                {/* Out Location */}
                <td className="px-3 py-2 text-xs text-gray-700">{row.outLocation ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
