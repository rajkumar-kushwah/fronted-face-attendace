
import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

export const loadFaceModels = async () => {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);

  console.log(" Face-api models loaded successfully");
};

export const getFaceDescriptor = async (videoEl) => {
  const detection = await faceapi
    .detectSingleFace(
      videoEl,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5,
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) return null;

  return Array.from(detection.descriptor); // convert Float32Array → normal array
};
