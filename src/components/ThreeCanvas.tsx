import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, OrbitControls, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { safeLocalStorage } from '../utils/safeLocalStorage';

// Constellation of floating neural nodes
function FloatingStars({ count = 180, themeColor = '#06b6d4' }) {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate random positions inside a sphere cloud
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical coordinate distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.3 + Math.random() * 2.0;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow orbital rotate drift of particles
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={themeColor}
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Scene({ speedMultiplier = 1.0, themeColor = '#06b6d4' }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const bloomRef = useRef<any>(null!);
  const prevCamPos = useRef(new THREE.Vector3());
  const speedRef = useRef(0);

  // Defensively prevent iframe serializers from scanning refs
  useMemo(() => {
    if (meshRef && !Object.prototype.hasOwnProperty.call(meshRef, 'toJSON')) {
      Object.defineProperty(meshRef, 'toJSON', { value: () => '[MeshRef]', enumerable: false, configurable: true });
    }
    if (materialRef && !Object.prototype.hasOwnProperty.call(materialRef, 'toJSON')) {
      Object.defineProperty(materialRef, 'toJSON', { value: () => '[MaterialRef]', enumerable: false, configurable: true });
    }
    if (bloomRef && !Object.prototype.hasOwnProperty.call(bloomRef, 'toJSON')) {
      Object.defineProperty(bloomRef, 'toJSON', { value: () => '[BloomRef]', enumerable: false, configurable: true });
    }
  }, []);

  useFrame((state) => {
    // Rotation of central holographic wireframe
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.12 * speedMultiplier;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.18 * speedMultiplier;
    }

    if (prevCamPos.current.lengthSq() === 0) {
      prevCamPos.current.copy(state.camera.position);
    }

    // Interactive mouse parallax zoom effect
    const distanceMoved = state.camera.position.distanceTo(prevCamPos.current);
    prevCamPos.current.copy(state.camera.position);

    const targetIntensityBonus = distanceMoved * 25.0;
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetIntensityBonus, 0.08);

    // Dynamic intensities based on camera orbit drag
    const finalBloomIntensity = 1.2 + Math.min(speedRef.current * 1.5, 4.0);
    const finalEmissiveIntensity = 1.5 + Math.min(speedRef.current * 2.0, 6.0);

    if (bloomRef.current) {
      bloomRef.current.intensity = finalBloomIntensity;
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = finalEmissiveIntensity;
    }
  });

  return (
    <>
      {/* Constellation particle cloud */}
      <FloatingStars count={180} themeColor={themeColor} />

      {/* Holographic Wireframe Core Sphere */}
      <Icosahedron 
        ref={(node) => { if (node) meshRef.current = node; }} 
        args={[1.0, 1]}
      >
        <meshStandardMaterial 
          ref={(node) => { if (node) materialRef.current = node; }}
          color={themeColor} 
          wireframe 
          emissive={themeColor}
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </Icosahedron>

      <OrbitControls 
        enableZoom={true} 
        enableDamping={true} 
        dampingFactor={0.05}
        rotateSpeed={0.8}
      />

      <EffectComposer>
        <Bloom 
          ref={(node) => { if (node) bloomRef.current = node; }}
          intensity={1.2} 
          luminanceThreshold={0.12} 
          luminanceSmoothing={1.0} 
          mipmapBlur 
        />
      </EffectComposer>
    </>
  );
}

export default function ThreeCanvas() {
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [themeColor, setThemeColor] = useState('#06b6d4');

  // Real-time listener checking for active theme shifts immediately
  useEffect(() => {
    const updateCanvasColors = () => {
      const activeTheme = safeLocalStorage.getItem("jarvis_active_theme") || "cyber-blue";
      if (activeTheme === 'neon-purple') {
        setThemeColor('#d946ef');
      } else if (activeTheme === 'red-tactical') {
        setThemeColor('#ef4444');
      } else if (activeTheme === 'matrix-green') {
        setThemeColor('#10b981');
      } else if (activeTheme === 'white-holo') {
        setThemeColor('#ffffff');
      } else {
        setThemeColor('#06b6d4'); // cyber-blue
      }
    };

    updateCanvasColors();

    // Listen to local storage changes to keep it in pure sync
    const interval = setInterval(updateCanvasColors, 900);
    window.addEventListener('storage', updateCanvasColors);
    return () => {
      window.removeEventListener('storage', updateCanvasColors);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center select-none">
      <div className="w-full h-[250px]">
        {/* Antialias is disabled for extreme performance safety in sandboxed iframes */}
        <Canvas camera={{ position: [0, 0, 3] }} gl={{ antialias: false }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 12, 4]} intensity={1.5} />
          <Scene speedMultiplier={speedMultiplier} themeColor={themeColor} />
        </Canvas>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-4 py-1.5 rounded-full flex items-center justify-between gap-3 w-64 backdrop-blur-md shadow-2xl pointer-events-auto font-mono text-[9px]">
        <span className="text-slate-400 font-bold shrink-0">ORBIT_SPIN:</span>
        <input 
          type="range" 
          min="0" 
          max="3.0" 
          step="0.05" 
          value={speedMultiplier} 
          onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
          className="w-full h-1 accent-cyan-400 bg-white/10 rounded-lg cursor-pointer grayscale-30"
          title="Adjust orbital rotation velocity scalar"
        />
        <span className="text-slate-300 font-bold w-10 text-right shrink-0">{(speedMultiplier * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
