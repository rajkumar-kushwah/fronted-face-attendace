import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { addEmployee } from "../utils/api";
import { X, Camera } from "lucide-react";
import { useFace } from "../context/FaceContext";
import FaceScan from "./FaceScan";
import { useUser } from "../context/UserContext";

export default function EmployeeAdd() {
  const navigate = useNavigate();
  const { addEmployeeLocal } = useUser();

  // Employee fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobRole, setJobRole] = useState("employee");
  const [department, setDepartment] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [dob, setDob] = useState("");
  const [status, setStatus] = useState("active");
  const [basicSalary, setBasicSalary] = useState("");

  // Face context
  const { faceData, setFaceData } = useFace();

  // Modal
  const [showFaceScan, setShowFaceScan] = useState(false);

  // -------------------------------
  // ADD EMPLOYEE
  // -------------------------------
const handleAdd = async () => {
  if (!name || !email || !department) {
    alert("Name, Email, Department required");
    return;
  }

  if (!faceData?.descriptor || faceData.descriptor.length !== 128) {
    alert("Please scan face first");
    return;
  }

  try {
    const formData = new FormData();

    // Normal fields
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("jobRole", jobRole);
    formData.append("department", department);
    formData.append("joinDate", joinDate);
    formData.append("dateOfBirth", dob);
    formData.append("status", status);
    formData.append("basicSalary", basicSalary);

    // Face descriptor
    formData.append("faceDescriptor", JSON.stringify(faceData.descriptor));

    // Face image
    const file = new File([faceData.image], "face.jpg", { type: "image/jpeg" });
    formData.append("faceImage", file);

    // --- CALL API ---
    const response = await addEmployee(formData); //  save in DB
    const newEmployee = response.data.employee;

    // --- SAVE IN LOCAL STORAGE ---
    addEmployeeLocal(newEmployee); //  now stored in localStorage

    alert("Employee added successfully!");
    navigate("/employees");
  } catch (err) {
    console.error("Add Employee Error:", err);
    alert(err?.response?.data?.message || "Employee add failed");
  }
};


  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-8 bg-white rounded-lg shadow p-5 relative text-sm">

        {/* Close */}
          <button
            onClick={() => navigate("/employees")}
            className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-black"
          >
            <X size={18} />
          </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5 relative">
          <img
            src={faceData?.preview || "/default-avatar.png"}
            className="w-14 h-14 rounded-full border object-cover mb-1 cursor-pointer"
            onClick={() => setShowFaceScan(true)}
            title="Click to scan face"
          />
          <Camera
            className="absolute bottom-0 left-0 top-0 cursor-pointer text-gray-600 hover:text-black"
            size={18}
            onClick={() => setShowFaceScan(true)}
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* DOB + Email */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Phone + Department */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Phone</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Department</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            />
          </div>
        </div>

        {/* Job Role + Status */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Job Role</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Status</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={status}
              onChange={e => setStatus(e.target.value)}
            />
          </div>
        </div>

        {/* Join Date + Salary */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Join Date</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1"
              value={joinDate}
              onChange={e => setJoinDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Basic Salary</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={basicSalary}
              onChange={e => setBasicSalary(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleAdd}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded"
        >
          Submit
        </button>

        {/* Face Scan Modal */}
        {showFaceScan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-96 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowFaceScan(false)}
              >
                <X size={18} />
              </button>
              <FaceScan
                onDone={() => setShowFaceScan(false)}
                setFaceData={setFaceData}
              />
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
