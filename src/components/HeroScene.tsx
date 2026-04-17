import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Environment, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";

function Minimal3DSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={sphereRef} position={[2, 0, -1]} scale={1.8}>
        <sphereGeometry args={[1, 24, 24]} />
        <MeshDistortMaterial
          color="#FFD700"
          roughness={0.3}
          metalness={0.8}
          distort={0.1}
          speed={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}



const HeroScene = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true
        }}
      >
        {/* Minimal lighting setup */}
        <ambientLight intensity={0.4} color="#FFFFFF" />
        <directionalLight
          position={[3, 3, 3]}
          intensity={0.8}
          color="#FFD700"
        />
        <pointLight position={[-2, -2, 2]} intensity={0.3} color="#FFA500" />

        {/* Minimal 3D element */}
        <Minimal3DSphere />

        {/* Subtle ground shadows */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.2}
          scale={8}
          blur={1}
          far={3}
        />
      </Canvas>
    </div>
  );
};

export default HeroScene;
