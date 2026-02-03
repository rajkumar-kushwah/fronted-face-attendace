import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import AttendanceTable from "./AttendanceTable";
import { getEmployeeAttendanceApi, getEmployeesApi, getFilteredAttendanceApi, deleteAttendanceApi } from "../utils/api";
import AttendanceFilter from "../attendances/AttendanceFilter";


export default function EmployeeAttendancePage() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
    const [filters, setFilters] = useState({});


  useEffect(() => {
    async function fetchData() {
      try {
        // 🔹 Employees fetch
        const empRes = await getEmployeesApi("6972164941d0a468448c5f2c");
        const emp = empRes.data.data.find(e => e._id === employeeId);

        if (emp) {
          // 🔹 Attendance fetch
          const attRes = await getEmployeeAttendanceApi(employeeId);
          emp.attendance = attRes.data; // attach attendance
          setEmployee(emp);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }

    fetchData();
  }, [employeeId]);

  if (!employee) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }
const companyId = "6972164941d0a468448c5f2c"; // yaha apna companyId

const applyFilter = async (filters) => {
  setFilters(filters);

  const today = new Date();
  const defaultFrom = new Date(today.getFullYear() - 10, 0, 1)
    .toISOString()
    .split("T")[0];
  const defaultTo = today.toISOString().split("T")[0];

  const params = {
    companyId: "6972164941d0a468448c5f2c",
    employeeId,
    fromDate: filters.fromDate || defaultFrom,
    toDate: filters.toDate || defaultTo,
    ...(filters.status ? { status: filters.status } : {}),
  };

  try {
    const res = await getFilteredAttendanceApi(params);
    setEmployee(prev => ({
      ...prev,
      attendance: res.data?.data || [], // ✅ THIS FIXES FILTER
    }));
  } catch (error) {
    console.error("Error fetching filtered attendance:", error);
  }
};



const handleDelete = async (employeeId, date) => {
  const companyId = "6972164941d0a468448c5f2c"; // tumhara companyId
  if (window.confirm("Are you sure you want to delete this attendance?")) {
    try {
      const res = await deleteAttendanceApi(employeeId, date, companyId);
      if (res.data.success) {
        alert(`Deleted ${res.data.deletedCount} attendance record(s)`);
        // ✅ Table update logic yahan
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting attendance");
    }
  }
};

  return (
    <Layout>
        <button className="text-xs cursor-pointer border rounded px-2 py-1 mb-5" onClick={() => window.history.back()}>back</button>
         {/* FILTER SECTION */}
      <AttendanceFilter onFilter={applyFilter} />
      <div className="flex items-center gap-3 mb-4">

       
        {/*  Employee Photo with fallback */}
        {employee.faceImage ? (
          <img
            src={employee.faceImage}
            alt={employee.name}
            className="w-16 h-16 rounded-full border object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
            {employee.name?.charAt(0) || "U"}
          </div>
        )}

        <h2 className="text-xl font-bold">
          Attendance of {employee.name}
        </h2>
      </div>

      {/* 🔹 Attendance Table */}
      <AttendanceTable data={employee.attendance} filters={filters} handleDelete={handleDelete}  />
    </Layout>
  );
}
