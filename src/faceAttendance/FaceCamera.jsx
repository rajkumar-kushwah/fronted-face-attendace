// src/faceAttendance/FaceCamera.jsx
import { useEffect, useRef, useState } from "react";
import { faceScanAttendance } from "../utils/api";

export default function FaceCamera({ onResult, status }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Start scanning only after video is ready
        requestAnimationFrame(scanFace); 
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  const scanFace = async () => {
    if (!videoRef.current || scanning) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL("image/jpeg");

    try {
      setScanning(true); // prevent overlap
      const res = await faceScanAttendance(imageBase64);
      onResult(res);
    } catch (err) {
      console.error("Scan failed:", err);
      onResult({ success: false });
    } finally {
      setScanning(false);
      requestAnimationFrame(scanFace); // continue scanning
    }
  };

  // BORDER COLOR
  const borderColor =
    status === "success"
      ? "border-green-500"
      : status === "failed"
      ? "border-red-500"
      : "border-gray-300";

  return (
    <div className={`w-80 h-60 border-4 ${borderColor} rounded-lg overflow-hidden`}>
      <video ref={videoRef} className="w-full h-full object-cover" muted />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
