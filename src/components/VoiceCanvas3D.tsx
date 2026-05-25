import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Torus, Cylinder, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface VoiceCanvas3DProps {
  isListening: boolean;
  activeSpeech: boolean;
}

function VoiceHologram({ isListening, activeSpeech }: VoiceCanvas3DProps) {
  const centralCoreRef = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Group>(null!);
  const diagonalAxisRef = useRef<THREE.Mesh>(null!);
  const outerSphereRef = useRef<THREE.Mesh>(null!);
  
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const bloomRef = useRef<any>(null!);
  const pulseScaleRef = useRef(1);
  const speedRef = useRef(0.5);

  // Prevent sandbox circular structure serialization issues on standard ref properties
  useMemo(() => {
    const refs = [centralCoreRef, outerRingRef, diagonalAxisRef, outerSphereRef, materialRef, bloomRef];
    refs.forEach((ref) => {
      if (ref && !Object.prototype.hasOwnProperty.call(ref, 'toJSON')) {
        Object.defineProperty(ref, 'toJSON', { value: () => '[3DRef]', enumerable: false, configurable: true });
      }
    });
  }, []);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    
    // Instantiated color objects for fluid transitions (lerps)
    const targetColor = new THREE.Color("#6366f1"); // Royal Purple/Indigo default
    const targetEmissive = new THREE.Color("#4f46e5");
    let targetSpeed = 0.6;
    let targetScale = 1.0;
    let targetBloomIntensity = 1.6;

    if (isListening) {
      // Fast active cybernetic feedback
      targetColor.set("#06b6d4"); // Cyan
      targetEmissive.set("#0891b2");
      targetSpeed = 2.4;
      targetScale = 1.0 + Math.sin(elapsedTime * 22) * 0.08; // High speed vibration
      targetBloomIntensity = 3.2;
    } else if (activeSpeech) {
      // Elegant speech wave breathing cycle
      targetColor.set("#ec4899"); // Vibrant Pink/Fuchsia
      targetEmissive.set("#db2777");
      targetSpeed = 1.3;
      targetScale = 1.1 + Math.sin(elapsedTime * 9) * 0.16; // Deep breathing scale
      targetBloomIntensity = 2.5;
    }

    // Linearly interpolate current metrics for smooth transitions
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 0.08);
    pulseScaleRef.current = THREE.MathUtils.lerp(pulseScaleRef.current, targetScale, 0.1);

    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, 0.08);
      materialRef.current.emissive.lerp(targetEmissive, 0.08);
    }

    if (bloomRef.current) {
      bloomRef.current.intensity = THREE.MathUtils.lerp(bloomRef.current.intensity, targetBloomIntensity, 0.08);
    }

    // Animate central core shell with multi-axis rotation
    if (centralCoreRef.current) {
      centralCoreRef.current.scale.setScalar(pulseScaleRef.current);
      centralCoreRef.current.rotation.x = elapsedTime * speedRef.current * 0.35;
      centralCoreRef.current.rotation.y = elapsedTime * speedRef.current * 0.55;
    }

    // Rotate flat equatorial ring grouping with periodic wave tilt
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -elapsedTime * speedRef.current * 0.25;
      outerRingRef.current.rotation.x = (Math.PI / 3) + Math.sin(elapsedTime * 0.6) * 0.08;
    }

    // Rotate diagonal needle
    if (diagonalAxisRef.current) {
      diagonalAxisRef.current.rotation.y = elapsedTime * speedRef.current * 0.8;
    }

    // Spin outer planetary plexus boundaries and dynamically scale
    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.y = elapsedTime * speedRef.current * 0.12;
      outerSphereRef.current.rotation.z = elapsedTime * speedRef.current * 0.08;
      
      const ambientPulse = 1.45 + (isListening ? Math.sin(elapsedTime * 22) * 0.03 : Math.sin(elapsedTime * 2.5) * 0.02);
      outerSphereRef.current.scale.setScalar(ambientPulse);
    }
  });

  return (
    <>
      {/* 1. Cybernetic diagonal pin slicing diagonally from top-left to bottom-right */}
      <Cylinder 
        ref={(node) => { if (node) diagonalAxisRef.current = node; }}
        args={[0.012, 0.012, 3.2, 8]}
        rotation={[0, 0, -Math.PI / 4]} // Tilted 45 degrees
      >
        <meshStandardMaterial 
          ref={(node) => { if (node) materialRef.current = node; }}
          color="#6366f1"
          emissive="#4f46e5"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
        />
      </Cylinder>

      {/* 2. High density patterned icosahedron core (represents structured brain patterns) */}
      <Icosahedron 
        ref={(node) => { if (node) centralCoreRef.current = node; }} 
        args={[0.65, 3]} // Level 3 subdivision to create beautiful dense wireframe
      >
        <meshStandardMaterial 
          color="#6366f1"
          emissive="#4f46e5"
          emissiveIntensity={1.8}
          wireframe
          transparent
          opacity={0.7}
        />
      </Icosahedron>

      {/* 3. Tilted equatorial ring disc structure */}
      <group ref={(node) => { if (node) outerRingRef.current = node; }}>
        {/* Outer flat ring */}
        <Torus 
          args={[1.15, 0.014, 8, 80]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial 
            color="#6366f1"
            emissive="#4f46e5"
            emissiveIntensity={2.2}
            transparent
            opacity={0.8}
          />
        </Torus>

        {/* Concentric interior target accent ring */}
        <Torus 
          args={[0.98, 0.008, 4, 60]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial 
            color="#22d3ee"
            emissive="#06b6d4"
            emissiveIntensity={1.5}
            transparent
            opacity={0.45}
          />
        </Torus>
      </group>

      {/* 4. Large wireframe circuit/plexus global boundary */}
      <Sphere 
        ref={(node) => { if (node) outerSphereRef.current = node; }}
        args={[1.45, 4]} // Low subdivisions for geometric plexus constellation texture
      >
        <meshStandardMaterial 
          color="#6366f1"
          emissive="#4f46e5"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.35}
        />
      </Sphere>

      <EffectComposer>
        <Bloom 
          ref={(node) => { if (node) bloomRef.current = node; }}
          intensity={1.6} 
          luminanceThreshold={0.02} 
          luminanceSmoothing={1.0} 
          mipmapBlur 
        />
      </EffectComposer>
    </>
  );
}

export default function VoiceCanvas3D({ isListening, activeSpeech }: VoiceCanvas3DProps) {
  return (
    <div className="w-full h-full relative" style={{ minHeight: '320px' }}>
      <Canvas 
        camera={{ position: [0, 0, 3.2] }} 
        gl={{ antialias: false }}
        className="w-full h-full pointer-events-none"
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <VoiceHologram isListening={isListening} activeSpeech={activeSpeech} />
      </Canvas>
    </div>
  );
}
