import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Globe, RefreshCw, Radio, Server, Compass, Network } from "lucide-react";

export default function HolographicEarth() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Parallax mouse offsets
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });

  // Handle subtle mouse parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setTargetMousePos({ x: x * 0.4, y: y * 0.4 });
    };

    const handleMouseLeave = () => {
      setTargetMousePos({ x: 0, y: 0 });
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Soft interpolation for smooth lag
  useEffect(() => {
    let animId: number;
    const updateParallax = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetMousePos.x - prev.x) * 0.08,
        y: prev.y + (targetMousePos.y - prev.y) * 0.08,
      }));
      animId = requestAnimationFrame(updateParallax);
    };
    updateParallax();
    return () => cancelAnimationFrame(animId);
  }, [targetMousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 380;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let angleY = 0;
    let angleX = 0;
    let pulseAngle = 0;

    // Fixed points on the globe matching simplified continental outlines
    const landPoints: { lat: number; lon: number }[] = [];
    const seedContinent = (baseLat: number, baseLon: number, sizeLat: number, sizeLon: number, count = 15) => {
      for (let i = 0; i < count; i++) {
        landPoints.push({
          lat: baseLat + (Math.random() - 0.5) * sizeLat,
          lon: baseLon + (Math.random() - 0.5) * sizeLon,
        });
      }
    };

    // Build standard representative "continents"
    seedContinent(20, -100, 30, 40, 20);  // North America
    seedContinent(-20, -60, 40, 30, 18);  // South America
    seedContinent(50, 10, 25, 45, 22);    // Europe
    seedContinent(5, 25, 35, 30, 20);     // Africa
    seedContinent(35, 100, 30, 60, 25);   // Asia
    seedContinent(-25, 135, 20, 25, 14);  // Australia

    // Satellite objects in specific orbits
    const satellites = [
      { angle: 0, speed: 0.015, rx: 145, ry: 45, size: 4, label: "SAT_ALPHA_01", color: "#00D4FF" },
      { angle: Math.PI / 2, speed: -0.01, rx: 165, ry: 25, size: 3.5, label: "SAT_BETA_02", color: "#7B61FF" },
      { angle: Math.PI, speed: 0.008, rx: 150, ry: 75, size: 3, label: "DAT_NOD_09", color: "#2D7FF9" }
    ];

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2 - 15; // Shift slightly higher to provide space for glowing base projector
      const r = 95; // Earth radius

      pulseAngle += 0.025;
      const pulseFactor = 1.0 + Math.sin(pulseAngle) * 0.02;

      // Increment base spin rotation
      angleY += 0.003; 
      
      // Inject mouse parallax offset into rotation
      const currentAngleY = angleY + mousePos.x * 0.5;
      const currentAngleX = mousePos.y * 0.4;

      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);

      // --- DRAW BASE 3D PROJECTION DECK (Hone cone beam) ---
      ctx.save();
      ctx.translate(cx, cy + r + 25);
      
      const projectorRad = 110;
      // Projection base gradient plate
      const floorGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, projectorRad);
      floorGrad.addColorStop(0, "rgba(0, 212, 255, 0.2)");
      floorGrad.addColorStop(0.5, "rgba(45, 127, 249, 0.04)");
      floorGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, projectorRad, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer projector deck circles
      ctx.strokeStyle = "rgba(0, 212, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, projectorRad * 0.8, 14, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(123, 97, 255, 0.25)";
      ctx.beginPath();
      ctx.ellipse(0, 0, projectorRad * 0.4, 7, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Base emitter center plate
      ctx.fillStyle = "rgba(0, 212, 255, 0.4)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00D4FF";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Holographic ray vectors soaring upwards
      ctx.strokeStyle = "rgba(0, 212, 255, 0.04)";
      ctx.beginPath();
      ctx.moveTo(-projectorRad * 0.4, 0);
      ctx.lineTo(-r * 0.8, -r - 10);
      ctx.lineTo(r * 0.8, -r - 10);
      ctx.lineTo(projectorRad * 0.4, 0);
      ctx.closePath();
      
      const coneGrad = ctx.createLinearGradient(0, -r - 10, 0, 0);
      coneGrad.addColorStop(0, "rgba(0, 212, 255, 0.06)");
      coneGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = coneGrad;
      ctx.fill();

      ctx.restore();

      // --- PROJECT SHADOW UNDER GLOBE ---
      const shadowGrad = ctx.createRadialGradient(cx, cy + r + 15, 5, cx, cy + r + 15, r * 1.2);
      shadowGrad.addColorStop(0, "rgba(0, 212, 255, 0.08)");
      shadowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + r + 15, r * 0.8, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- 3D ROTATION HELPER METHOD ---
      const projectCoords = (x3d: number, y3d: number, z3d: number) => {
        // Rotate around Y center
        let x1 = x3d * cosY - z3d * sinY;
        let z1 = x3d * sinY + z3d * cosY;
        
        // Rotate around X center
        let y2 = y3d * cosX - z1 * sinX;
        let z2 = y3d * sinX + z1 * cosX;

        // Perspective division
        const scale = 260 / (260 + z2);
        const px = cx + x1 * scale * pulseFactor;
        const py = cy + y2 * scale * pulseFactor;

        return { px, py, z2, scale };
      };

      // --- DRAW BACK OF LATITUDE & LONGITUDE CIRCULAR GRIDS ---
      ctx.lineWidth = 0.5;
      
      // Latitude Parallels
      const latSteps = [-60, -30, 0, 30, 60];
      latSteps.forEach((lat) => {
        const theta = (lat * Math.PI) / 180;
        const latRadius = r * Math.cos(theta);
        const latY = r * Math.sin(theta);

        ctx.strokeStyle = lat === 0 ? "rgba(45, 127, 249, 0.12)" : "rgba(0, 212, 255, 0.05)";
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 6) {
          const phi = (i * Math.PI) / 180;
          const x3d = latRadius * Math.cos(phi);
          const z3d = latRadius * Math.sin(phi);
          const { px, py, z2 } = projectCoords(x3d, latY, z3d);
          
          if (z2 >= 0) { // Only draw rear coordinates in this phase
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      });

      // Longitude Meridians (Grid loops passing through poles)
      const lonSteps = [0, 45, 90, 135];
      lonSteps.forEach((lonOffset) => {
        ctx.strokeStyle = "rgba(0, 212, 255, 0.05)";
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 6) {
          const theta = (i * Math.PI) / 180;
          const lonRad = (lonOffset * Math.PI) / 180;
          
          const x3d = r * Math.cos(theta) * Math.cos(lonRad);
          const y3d = r * Math.sin(theta);
          const z3d = r * Math.cos(theta) * Math.sin(lonRad);
          const { px, py, z2 } = projectCoords(x3d, y3d, z3d);

          if (z2 >= 0) { // Read back loop indices
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      });

      // --- DRAW REAR LAND MAPPING COORDINATES ---
      landPoints.forEach((pt) => {
        const latRad = (pt.lat * Math.PI) / 180;
        const lonRad = (pt.lon * Math.PI) / 180;

        const x3d = r * Math.cos(latRad) * Math.cos(lonRad);
        const y3d = r * Math.sin(latRad);
        const z3d = r * Math.cos(latRad) * Math.sin(lonRad);

        const { px, py, z2 } = projectCoords(x3d, y3d, z3d);
        if (z2 >= 0) { // Draw rear dots (darker / translucent)
          ctx.fillStyle = "rgba(0, 212, 255, 0.15)";
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- DRAW GLOBE BOUNDARY CIRCLE (Glass outer boundary) ---
      const innerGrad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r);
      innerGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      innerGrad.addColorStop(0.85, "rgba(0, 212, 255, 0.02)");
      innerGrad.addColorStop(1, "rgba(45, 127, 249, 0.08)");
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * pulseFactor, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 212, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r * pulseFactor, 0, Math.PI * 2);
      ctx.stroke();

      // --- DRAW FRONT OF LATITUDE & LONGITUDE CIRCULAR GRIDS ---
      ctx.lineWidth = 0.5;
      
      // Latitude Parallels (Front)
      latSteps.forEach((lat) => {
        const theta = (lat * Math.PI) / 180;
        const latRadius = r * Math.cos(theta);
        const latY = r * Math.sin(theta);

        ctx.strokeStyle = lat === 0 ? "rgba(45, 127, 249, 0.25)" : "rgba(0, 212, 255, 0.1)";
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 6) {
          const phi = (i * Math.PI) / 180;
          const x3d = latRadius * Math.cos(phi);
          const z3d = latRadius * Math.sin(phi);
          const { px, py, z2 } = projectCoords(x3d, latY, z3d);
          
          if (z2 < 0) { // Only draw front coordinates
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      });

      // Longitude Meridians (Front)
      lonSteps.forEach((lonOffset) => {
        ctx.strokeStyle = "rgba(0, 212, 255, 0.1)";
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 6) {
          const theta = (i * Math.PI) / 180;
          const lonRad = (lonOffset * Math.PI) / 180;
          
          const x3d = r * Math.cos(theta) * Math.cos(lonRad);
          const y3d = r * Math.sin(theta);
          const z3d = r * Math.cos(theta) * Math.sin(lonRad);
          const { px, py, z2 } = projectCoords(x3d, y3d, z3d);

          if (z2 < 0) { // Front loop indices
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      });

      // --- DRAW FRONT LAND MAPPING COORDINATES ---
      landPoints.forEach((pt) => {
        const latRad = (pt.lat * Math.PI) / 180;
        const lonRad = (pt.lon * Math.PI) / 180;

        const x3d = r * Math.cos(latRad) * Math.cos(lonRad);
        const y3d = r * Math.sin(latRad);
        const z3d = r * Math.cos(latRad) * Math.sin(lonRad);

        const { px, py, z2 } = projectCoords(x3d, y3d, z3d);
        if (z2 < 0) { // Draw foreground points with high cyan glow
          ctx.fillStyle = "#00D4FF";
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#00D4FF";
          ctx.beginPath();
          ctx.arc(px, py, 2.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // --- DRAW DYNAMIC SATELLITES AND MEMORY ORBITS ---
      satellites.forEach((sat, sIdx) => {
        sat.angle += sat.speed;
        
        // Circular orbit coordinate formulation around tilted path
        const satX3d = Math.cos(sat.angle) * sat.rx;
        const satY3d = Math.sin(sat.angle) * 15; // orbital planar tilt offset
        const satZ3d = Math.sin(sat.angle) * sat.ry;

        const { px, py, z2 } = projectCoords(satX3d, satY3d, satZ3d);

        // Orbit path wire loop ellipse
        ctx.strokeStyle = `rgba(${sIdx === 0 ? "0, 212, 255" : sIdx === 1 ? "123, 97, 255" : "45, 127, 249"}, 0.15)`;
        ctx.beginPath();
        
        // Plot path circle
        for (let j = 0; j <= Math.PI * 2; j += 0.1) {
          const pPathX = Math.cos(j) * sat.rx;
          const pPathY = Math.sin(j) * 15;
          const pPathZ = Math.sin(j) * sat.ry;
          const projPath = projectCoords(pPathX, pPathY, pPathZ);
          if (j === 0) ctx.moveTo(projPath.px, projPath.py);
          else ctx.lineTo(projPath.px, projPath.py);
        }
        ctx.closePath();
        ctx.stroke();

        // Draw active satellite body with deep core glowing aura
        ctx.save();
        ctx.translate(px, py);
        
        ctx.shadowBlur = z2 < 0 ? 12 : 5;
        ctx.shadowColor = sat.color;
        ctx.fillStyle = z2 < 0 ? sat.color : "rgba(148, 163, 184, 0.4)";
        ctx.beginPath();
        ctx.arc(0, 0, sat.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Satellite Vector pointer/labels in foreground
        if (z2 < 0) {
          ctx.strokeStyle = "rgba(0, 212, 255, 0.25)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(12, -12);
          ctx.stroke();

          ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
          ctx.font = "bold 6px monospace";
          ctx.fillText(sat.label, 15, -10);
        }
        ctx.restore();
      });

      // --- CONNECT INTEGRATION NODES WIREFRAME ---
      // Randomly draw a connection line between two visible satellites
      if (Math.random() > 0.4) {
        ctx.strokeStyle = "rgba(0, 212, 255, 0.15)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        const sat0X = Math.cos(satellites[0].angle) * satellites[0].rx;
        const sat0Y = Math.sin(satellites[0].angle) * 15;
        const sat0Z = Math.sin(satellites[0].angle) * satellites[0].ry;
        const p0 = projectCoords(sat0X, sat0Y, sat0Z);

        const sat1X = Math.cos(satellites[1].angle) * satellites[1].rx;
        const sat1Y = Math.sin(satellites[1].angle) * 15;
        const sat1Z = Math.sin(satellites[1].angle) * satellites[1].ry;
        const p1 = projectCoords(sat1X, sat1Y, sat1Z);

        ctx.moveTo(p0.px, p0.py);
        ctx.lineTo(p1.px, p1.py);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center p-4 overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-xl backdrop-blur-xl h-[400px] select-none">
      {/* Absolute high-tech glowing backgrounds */}
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(0,214,255,0.03),transparent)] pointer-events-none" />
      <div className="absolute rounded-full w-48 h-48 bg-cyan-400/10 filter blur-3xl pointer-events-none animate-pulse" />
      
      {/* Floating HUD Labels in Corner */}
      <div className="absolute top-4 left-4 font-mono text-[8px] tracking-widest text-[#2D7FF9] uppercase leading-relaxed text-left">
        <div className="flex items-center gap-1.5 font-bold"><Globe size={10} /> EARTH_MAP: J_OS_M21</div>
        <div className="text-slate-400 font-medium">Coordinate: 52.23°N, 12.43°E</div>
      </div>

      <div className="absolute top-4 right-4 font-mono text-[8px] tracking-widest text-[#7B61FF] uppercase text-right leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold justify-end">ACTIVE LINK <Radio size={10} className="animate-pulse" /></div>
        <div className="text-slate-400 font-medium font-bold text-cyan-500">Telemetry: online</div>
      </div>

      {/* Holographic Projection Canvas */}
      <canvas ref={canvasRef} className="relative z-10 transition-transform duration-300 pointer-events-none" />

      {/* Futuristic scanning pointer at bottom */}
      <div className="absolute bottom-6 flex items-center gap-3 font-mono text-[9px] text-[#00D4FF] bg-[#2D7FF9]/5 border border-[#2D7FF9]/20 px-3.5 py-1.5 rounded-full select-none cursor-pointer hover:border-[#00D4FF] hover:bg-[#00D4FF]/5 transition-all shadow-md">
        <Network size={11} className="animate-spin text-cyan-400" />
        <span className="font-bold uppercase tracking-wider">Holographic Grid Projection Array Activated</span>
      </div>
    </div>
  );
}
