import { useState } from "react";
import FaceCamera from "../faceAttendance/FaceCamera";
import EmployeePreview from "../faceAttendance/EmployeePreview";
import {
  verifyFaceApi,
  punchInApi,
  punchOutApi
} from "../utils/api";
import Layout from "../components/Layout";

export default function AttendanceScan() {
  const [employee, setEmployee] = useState(null);
  const [status, setStatus] = useState(null); // null | IN

  // Punch In button click → camera capture yahin hota hai
  const handlePunchInCapture = async (imageBase64) => {
    try {
      //  Verify face
      const res = await verifyFaceApi({
        companyId: "6972164941d0a468448c5f2c",
        image: imageBase64
      });

      const emp = res.data.employee;
      setEmployee(emp);

      //  Punch In
      await punchInApi({
        companyId: "6972164941d0a468448c5f2c",
        employeeId: emp.id,
        location: "Connaught Place, Delhi"
      });

      setStatus("IN");
    } catch (err) {
      alert("Face not matched / Punch In failed");
      console.error(err);
    }
  };

  const punchOut = async () => {
    try {
      await punchOutApi({
        companyId: "6972164941d0a468448c5f2c",
        employeeId: employee._id,
        location: "Connaught Place, Delhi"
      });

      // reset for next employee
      setEmployee(null);
      setStatus(null);
    } catch (err) {
      alert("Punch Out failed");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">

        {/* ONE CAMERA ONLY */}
        <FaceCamera
          onCapture={handlePunchInCapture}
          disabled={status === "IN"}
        />

        {/* Live employee preview */}
        <EmployeePreview employee={employee} />

        {/* Punch Out */}
        {employee && status === "IN" && (
          <button
            onClick={punchOut}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded"
          >
            PUNCH OUT
          </button>
        )}
      </div>
    </Layout>
  );
}
