// src/faceAttendance/AttendanceScan.jsx
import { useState } from "react";
import FaceCamera from "./FaceCamera";
import Layout from "../components/Layout";
export default function AttendanceScan() {
    const [scanResult, setScanResult] = useState(null);
    const [status, setStatus] = useState("scanning");
    // scanning | success | failed

    return (
        <Layout>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">

                <h1 className="text-2xl font-bold mb-4">
                    Face Attendance
                </h1>

                {/* CAMERA */}
                <FaceCamera
                    onResult={(result) => {
                        if (result.success) {
                            setScanResult(result);
                            setStatus("success");
                        } else {
                            setScanResult(null);
                            setStatus("failed");
                        }
                    }}
                    status={status}
                />

                {/* RESULT CARD */}
                <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow p-4">
                    {status === "scanning" && (
                        <p className="text-center text-gray-500">
                            Scanning face...
                        </p>
                    )}

                    {status === "failed" && (
                        <p className="text-center text-red-500 font-semibold">
                            Face not recognized
                        </p>
                    )}

                    {status === "success" && scanResult && (
                        <div className="space-y-3 text-center">
                            <p><b>Name:</b> {scanResult.name}</p>
                            <p><b>Employee Code:</b> {scanResult.employeeCode}</p>
                            <button
                                onClick={() => handlePunchIn(scanResult._id)}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Punch In
                            </button>
                            <button
                                onClick={() => handlePunchOut(scanResult._id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Punch Out
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
