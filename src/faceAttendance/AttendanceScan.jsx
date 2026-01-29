import { useState } from "react";
import FaceCamera from "../faceAttendance/FaceCamera";
import EmployeePreview from "../faceAttendance/EmployeePreview";
import { verifyFaceApi, punchInApi, punchOutApi } from "../utils/api";
import Layout from "../components/Layout";

export default function AttendanceScan() {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // verification / punch animation
  const [cameraKey, setCameraKey] = useState(Date.now()); // reset camera
  const [successMessage, setSuccessMessage] = useState("");

  // Face scan → decide Punch OUT button
  const handleFaceDetected = async (imageBase64) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await verifyFaceApi({
        companyId: "6972164941d0a468448c5f2c",
        image: imageBase64
      });

      const emp = res.data.employee;
      const attendanceStatus = res.data.attendanceStatus; // NOT_PUNCHED | IN | OUT

      setEmployee({ ...emp, attendanceStatus });

      if (attendanceStatus === "IN") {
        setSuccessMessage("Employee already Punched IN. Ready to Punch OUT.");
      } else if (attendanceStatus === "OUT") {
        setSuccessMessage(" Employee already Punched OUT today");
      } else {
        setSuccessMessage(""); // Punch IN button will be shown
      }

    } catch (err) {
      alert("Face not matched / Failed");
      setEmployee(null);
      console.error(err);
    } finally {
      // short delay just to reset camera
      setTimeout(() => {
        setCameraKey(Date.now());
        setIsLoading(false);
      }, 1000);
    }
  };

  // Manual Punch IN
  const handlePunchIn = async () => {
    if (!employee || isLoading) return;
    setIsLoading(true);

    try {
      await punchInApi({
        companyId: "6972164941d0a468448c5f2c",
        employeeId: employee.id,
        location: "Connaught Place, Delhi"
      });

      setEmployee((prev) => ({ ...prev, attendanceStatus: "IN" }));
      setSuccessMessage(" Punch IN Successful");

      // Clear after 3 seconds
      setTimeout(() => {
        setEmployee(null);
        setSuccessMessage("");
        setCameraKey(Date.now());
      }, 3000);

    } catch (err) {
      alert("Punch IN failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Punch OUT
  const handlePunchOut = async () => {
    if (!employee || isLoading) return;
    setIsLoading(true);

    try {
      await punchOutApi({
        companyId: "6972164941d0a468448c5f2c",
        employeeId: employee.id,
        location: "Connaught Place, Delhi"
      });

      setEmployee((prev) => ({ ...prev, attendanceStatus: "OUT" }));
      setSuccessMessage(" Punch OUT Successful");

      // Clear after 3 seconds
      setTimeout(() => {
        setEmployee(null);
        setSuccessMessage("");
        setCameraKey(Date.now());
      }, 3000);

    } catch (err) {
      alert("Punch OUT failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">

        {/* Camera */}
        <FaceCamera
          key={cameraKey}
          onCapture={handleFaceDetected}
          disabled={isLoading}
        />

        {/* Employee Preview */}
        <EmployeePreview employee={employee} />

        {/* Punch IN button */}
        {employee && employee.attendanceStatus === "NOT_PUNCHED" && (
          <button
            onClick={handlePunchIn}
            disabled={isLoading}
            className="mt-4 w-full cursor-pointer bg-green-600 text-white py-2 rounded"
          >
            PUNCH IN
          </button>
        )}

        {/* Punch OUT button */}
        {employee && employee.attendanceStatus === "IN" && (
          <button
            onClick={handlePunchOut}
            disabled={isLoading}
            className="mt-4 w-full cursor-pointer bg-red-600 text-white py-2 rounded"
          >
            PUNCH OUT
          </button>
        )}

        {/* Spinning verification animation */}
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
            <p className="mt-2 text-blue-600 font-semibold">
              {successMessage || "Verifying..."}
            </p>
          </div>
        )}

        {/* Success message after punch completed */}
        {!isLoading && successMessage && (
          <p className="mt-4 text-center font-bold text-green-600">
            {successMessage}
          </p>
        )}

      </div>
    </Layout>
  );
}
