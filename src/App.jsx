import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";

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
    <mesh ref={meshRef} position={[-1, 1, 0]} onClick={() => setIsRed(!isRed)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isRed ? "red" : "blue"}
        metalness={0.5}
        roughness={0.1}
      />
    </mesh>
  );
}

function RubberDuck() {
  const { scene } = useGLTF(
    "https://grafsoul.github.io/ar-react-three-fiber/toy.glb"
  );
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={ref} object={scene} position={[-1, 0, 0]} scale={6} />;
}

function Rat() {
  const { scene } = useGLTF("rat.glb");
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive ref={ref} object={scene} position={[1, 0.5, 0]} scale={25} />
  );
}

export function App() {
  const [useDuck, setUseDuck] = useState(false);

  const handleToggleDuck = () => {
    setUseDuck(!useDuck);
  };

  return (
    <>
      <div className="buttons-container">
        <button className="button" onClick={() => store.enterAR()}>
          Enter AR
        </button>
        <button className="button" onClick={handleToggleDuck}>
          Toggle Rat/Duck
        </button>
      </div>

      <Canvas style={{ width: "100%", height: "100%" }}>
        <XR store={store}>
          <Suspense>
            <hemisphereLight
              skyColor={0xb1e1ff}
              groundColor={0xb97a20}
              intensity={2}
            />
            <directionalLight
              color={0xffffff}
              intensity={2}
              position={[5, 10, 5]}
              castShadow
            />
            <PerspectiveCamera makeDefault position={[0, 2, 8]} />
            <Rat />
            {useDuck ? <RubberDuck /> : <RotatingBox />}
            <OrbitControls />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}

export default App;
