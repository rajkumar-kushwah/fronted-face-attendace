import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadFaceModels, getFaceDescriptor } from "../utils/faceApi";

export default function FaceScan({ setFaceData }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFaceModels();
    startCamera();
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
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

  const imageBlob = await new Promise(res =>
    canvas.toBlob(res, "image/jpeg")
  );

  // stop camera
  const stream = videoRef.current.srcObject;
  stream.getTracks().forEach(t => t.stop());
  videoRef.current.srcObject = null;

  setFaceData({
    descriptor,
    image: imageBlob,
    preview: URL.createObjectURL(imageBlob),
  });

 navigate("/employee/add");

};

  // stopcapture cemra
    const stopCamera = () => {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      navigate(-1);

    }

  return (
    <div className=" w-64 h-64 mx-auto mt-5">
      <video ref={videoRef} autoPlay className="w-64 h-64 rounded-full object-cover mx-auto" />
      <button onClick={captureFace} className="btn mt-4 px-2 py-1 border rounded bg-gray-400 hover:bg-gray-300 cursor-pointer">
        Scan & Save
      </button>
      <button onClick={stopCamera} className="btn mt-4 px-2 py-1 border rounded bg-gray-400  hover:bg-gray-300 cursor-pointer">
        Stop Camera
      </button>
    </div>
  );
}

