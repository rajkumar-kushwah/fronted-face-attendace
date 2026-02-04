import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadFaceModels, getFaceDescriptor } from "../utils/faceApi";

export default function FaceScan({ setFaceData, onDone }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // store stream
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await loadFaceModels();
      await startCamera();
    };
    init();

    // Cleanup: component unmount ya modal close
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const captureFace = async () => {
    const rawDescriptor = await getFaceDescriptor(videoRef.current);

    if (!rawDescriptor) {
      alert("Face not detected");
      return;
    }

    const descriptor = Array.from(rawDescriptor);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    const imageBlob = await new Promise(res => canvas.toBlob(res, "image/jpeg"));

    // stop camera after capture
    stopCamera();

    setFaceData({
      descriptor,
      image: imageBlob,
      preview: URL.createObjectURL(imageBlob),
    });

    if (onDone) onDone(); // call modal close
  };

  return (
    <div className=" w-64 h-64 mx-auto mt-5">
      <video
        ref={videoRef}
        autoPlay
        className="w-64 h-64 rounded-full object-cover mx-auto"
      />
      <button
        onClick={captureFace}
        className="btn mt-4 px-2 py-1 border rounded bg-gray-400 hover:bg-gray-300 cursor-pointer"
      >
        Scan & Save
      </button>
      <button
        onClick={() => { stopCamera(); if(onDone) onDone(); }}
        className="btn mt-4 px-2 py-1 border rounded bg-gray-400 hover:bg-gray-300 cursor-pointer"
      >
        Stop Camera
      </button>
    </div>
  );
}
