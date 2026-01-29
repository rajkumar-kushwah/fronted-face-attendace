import { useEffect, useRef } from "react";

export default function FaceCamera({ onCapture, disabled }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Camera permission denied");
        console.error(err);
      }
    };

    startCamera();

    //  Cleanup: stop camera on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handlePunchInClick = () => {
    if (disabled) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    const imageBase64 = canvas.toDataURL("image/jpeg");
    onCapture(imageBase64);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted className="rounded-lg w-full" />
      <button
        onClick={handlePunchInClick}
        disabled={disabled}
        className={`mt-2 w-full py-2 rounded text-white ${
          disabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
        }`}
      >
        Punch In
      </button>
    </div>
  );
}
