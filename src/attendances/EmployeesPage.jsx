import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployeesApi } from "../utils/api";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const companyId = "6972164941d0a468448c5f2c";
  const navigate = useNavigate();

  useEffect(() => {
    getEmployeesApi(companyId).then((res) => {
      setEmployees(res.data.data);
    });
  }, []);

  return (
   <div>
      <h2 className="text-xl font-bold mb-4">Employees</h2>

      <table className="w-full text-xs text-left border border-r border-gray-300 mb-6">
        <thead className="bg-gray-100 border-b border-r border-gray-300">
          <tr>
            <th className=" p-2 border-r border-gray-300">Code</th>
            <th className=" p-2 border-r border-gray-300">Name</th>
            <th className=" p-2 border-r border-gray-300">Phone</th>
            <th className=" p-2 border-r border-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="border-r border-gray-300 p-2">{emp.employeeCode}</td>

              {/* Name + Image */}
              <td className="border-r border-gray-300  p-2 flex items-center gap-2">
                {emp.faceImage ? (
                  <img
                    src={emp.faceImage}
                    alt={emp.name}
                    className="w-8 h-8  rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8  rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">
                    {emp.name?.charAt(0) || "U"}
                  </div>
                )}
                <span>{emp.name}</span>
              </td>

              <td className="border-r border-gray-300 p-2">{emp.phone}</td>

              <td className="border-r border-gray-300 p-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-3 py-1 rounded"
                  onClick={() => navigate(`/attendance/${emp._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
