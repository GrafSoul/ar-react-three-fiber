/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { OrbitControls, Environment } from "@react-three/drei";

const store = createXRStore();

function App() {
  const [isRed, setIsRed] = useState(true);
  const [supportsWebXR, setSupportsWebXR] = useState(true);
  const videoRef = useRef();

  useEffect(() => {
    const checkWebXRSupport = async () => {
      if (navigator.xr) {
        try {
          const isSupported = await navigator.xr.isSessionSupported(
            "immersive-ar"
          );
          setSupportsWebXR(isSupported);
        } catch (error) {
          setSupportsWebXR(false);
        }
      } else {
        setSupportsWebXR(false);
      }
    };

    checkWebXRSupport();
  }, []);

  useEffect(() => {
    if (supportsWebXR) {
      const getCameraStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        } catch (error) {
          console.error("Error accessing camera: ", error);
        }
      };

      getCameraStream();
    }
  }, [supportsWebXR]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {supportsWebXR && (
        <video
          ref={videoRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
          autoPlay
          muted
        />
      )}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
        gl={{ alpha: true }}>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <mesh
            position={[0, 0, 0]}
            onClick={() => setIsRed(!isRed)}
            castShadow
            receiveShadow>
            <boxGeometry />
            <meshStandardMaterial color="red" metalness={0.5} roughness={0.1} />
          </mesh>
          <OrbitControls />
          <Environment preset="sunset" />
        </XR>
      </Canvas>
    </div>
  );
}

export default App;
