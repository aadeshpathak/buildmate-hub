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
          roughness={0.1}
          metalness={0.9}
          distort={0.05}
          speed={0.3}
          transparent
          opacity={0.8}
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
        {/* Professional 3-point lighting setup */}
        {/* Key Light - Main illumination */}
        <directionalLight
          position={[3, 3, 3]}
          intensity={1.2}
          color="#FFD700"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Fill Light - Soft illumination */}
        <directionalLight
          position={[-2, 2, 2]}
          intensity={0.4}
          color="#FFA500"
        />

        {/* Rim Light - Edge definition */}
        <directionalLight
          position={[0, -3, -2]}
          intensity={0.6}
          color="#FFFFFF"
        />

        {/* Ambient Light - Overall illumination */}
        <ambientLight intensity={0.2} color="#FFFFFF" />

        {/* Minimal 3D element */}
        <Minimal3DSphere />

        {/* Realistic ground shadows */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.4}
          scale={12}
          blur={2.5}
          far={4.5}
        />
      </Canvas>
    </div>
  );
};

export default HeroScene;
