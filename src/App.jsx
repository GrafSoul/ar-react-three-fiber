import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";

const store = createXRStore();

function RotatingBox() {
  const meshRef = useRef();
  const [isRed, setIsRed] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} onClick={() => setIsRed(!isRed)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={isRed ? "red" : "blue"} />
    </mesh>
  );
}

export function App() {
  return (
    <>
      <button
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
        onClick={() => store.enterAR()}>
        Enter AR
      </button>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <XR store={store}>
          <ambientLight intensity={1.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <RotatingBox />
          <OrbitControls />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
