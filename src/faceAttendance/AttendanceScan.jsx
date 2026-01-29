import { useState } from "react";
import FaceCamera from "../faceAttendance/FaceCamera";
import EmployeePreview from "../faceAttendance/EmployeePreview";
import { verifyFaceApi, punchInApi, punchOutApi } from "../utils/api";
import Layout from "../components/Layout";

export default function AttendanceScan() {
  const [employee, setEmployee] = useState(null);
  const [status, setStatus] = useState(null); // null | IN
  const [isLoading, setIsLoading] = useState(false); // verification / punch animation
  const [cameraKey, setCameraKey] = useState(Date.now()); // reset camera
  const [successMessage, setSuccessMessage] = useState("");

  // Punch In → camera capture
  const handlePunchInCapture = async (imageBase64) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 1️⃣ Verify face
      const res = await verifyFaceApi({
        companyId: "6972164941d0a468448c5f2c",
        image: imageBase64
      });

      const emp = res.data.employee;
      setEmployee(emp);

      // 2️⃣ Punch In
      await punchInApi({
        companyId: "6972164941d0a468448c5f2c",
        employeeId: emp.id,
        location: "Connaught Place, Delhi"
      });

      setStatus("IN");
      setSuccessMessage("✅ Punch IN Successful");

      // 3️⃣ Auto clear after 3 seconds
      setTimeout(() => {
        setEmployee(null);
        setStatus(null);
        setSuccessMessage("");
        setCameraKey(Date.now()); // reset camera
        setIsLoading(false);
      }, 3000);

    } catch (err) {
      alert("Face not matched / Punch In failed");
      console.error(err);
      setIsLoading(false);
    }
  };

  // Punch Out
  const handlePunchOut = async () => {
    if (!employee) return;
    setIsLoading(true);

    try {
      await punchOutApi({
        companyId: "6972164941d0a468448c5f2c",
        employeeId: employee._id,
        location: "Connaught Place, Delhi"
      });

      setSuccessMessage("✅ Punch OUT Successful");

      // Auto clear after 3 seconds
      setTimeout(() => {
        setEmployee(null);
        setStatus(null);
        setSuccessMessage("");
        setCameraKey(Date.now()); // reset camera for next employee
        setIsLoading(false);
      }, 3000);

    } catch (err) {
      alert("Punch Out failed");
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">

        {/* Camera */}
        <FaceCamera
          key={cameraKey} // reset camera for next employee
          onCapture={handlePunchInCapture}
          disabled={isLoading || status === "IN"} 
        />

        {/* Live Employee Preview */}
        <EmployeePreview employee={employee} />

        {/* Punch Out */}
        {employee && status === "IN" && (
          <button
            onClick={handlePunchOut}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded"
            disabled={isLoading}
          >
            PUNCH OUT
          </button>
        )}

        {/* Success / Verification Animation */}
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
            <p className="mt-2 text-blue-600 font-semibold">
              {successMessage || "Verifying..."}
            </p>
          </div>
        )}

        {/* Success Message (after punch completed) */}
        {!isLoading && successMessage && (
          <p className="mt-4 text-center text-green-600 font-bold">
            {successMessage}
          </p>
        )}

      </div>
    </Layout>
  );
}
