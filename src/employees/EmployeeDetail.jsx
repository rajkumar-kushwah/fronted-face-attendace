import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployeeById, deleteEmployee } from "../utils/api";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return navigate("/employees");

    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(id);
        const emp = res.data.employee || res.data.emp || res.data.data || res.data;
        setEmployee(emp);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Employee not found");
        navigate("/employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      alert("Employee deleted successfully!");
      navigate("/employees");
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <Layout><div className="p-6 text-center">Loading...</div></Layout>;
  if (!employee) return <Layout><div className="p-6 text-center">Employee not found</div></Layout>;

  return (
    <Layout>
       {/* Actions */}
        <div className="flex gap-2 justify-end mb-2">
          <button
            onClick={() => navigate(`/employee/${id}/edit`)}
            className="text-gray-600 hover:bg-gray-200 border px-2 py-1 cursor-pointer rounded text-xs"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className=" text-gray-600 hover:bg-gray-200 border  px-2 py-1 cursor-pointer rounded text-xs"
          >
            Delete
          </button>
        </div>
        {/* Employee detail */}
      <div className="max-w-sm mx-auto shadow rounded-lg p-4 text-xs space-y-2">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <img
            src={employee.faceImage || "/default-avatar.png"}
            alt="Employee Face"
            className="w-16 h-16 rounded-full object-cover mb-1 border"
          />
          <h2 className="text-sm font-semibold">{employee.name}</h2>
          <p className="text-gray-500 text-xs">{employee.jobRole || "-"}</p>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <p><strong>Employee Code:</strong> {employee.employeeCode || "-"}</p>
          <p><strong>Email:</strong> {employee.email || "-"}</p>
          <p><strong>Phone:</strong> {employee.phone || "-"}</p>
          <p><strong>DOB:</strong> {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "-"}</p>
          <p><strong>Department:</strong> {employee.department || "-"}</p>
          <p><strong>Status:</strong> {employee.status || "-"}</p>
          <p><strong>Join Date:</strong> {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : "-"}</p>
          <p><strong>Salary:</strong> {employee.basicSalary || "-"}</p>
        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-3">
          <button
            onClick={() => navigate("/employees")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 cursor-pointer rounded text-xs"
          >
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
}
