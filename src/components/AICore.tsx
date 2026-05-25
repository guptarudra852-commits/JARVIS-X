import React, { useEffect, useRef, useState } from "react";

interface AICoreProps {
  status?: "idle" | "listening" | "processing" | "alert";
  onCoreClick?: () => void;
  size?: number;
}

export default function AICore({ status = "idle", onCoreClick, size = 320 }: AICoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resizing for crisp retina rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let angleX = 0;
    let angleY = 0;
    let pulseAngle = 0;

    // Generate fixed 3D particles on a sphere structure
    const numParticles = 120;
    const particles: { x3d: number; y3d: number; z3d: number; size: number; phase: number }[] = [];
    for (let i = 0; i < numParticles; i++) {
      const theta = Math.acos(Math.random() * 2 - 1);
      const phi = Math.random() * Math.PI * 2;
      const radius = 60; // sphere radius
      particles.push({
        x3d: radius * Math.sin(theta) * Math.cos(phi),
        y3d: radius * Math.sin(theta) * Math.sin(phi),
        z3d: radius * Math.cos(theta),
        size: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Outer ring nodes
    const ringNodes: { angle: number; speed: number; radius: number; color: string }[] = [];
    for (let i = 0; i < 4; i++) {
      ringNodes.push({
        angle: (i * Math.PI) / 2,
        speed: (Math.random() * 0.02 + 0.01) * (i % 2 === 0 ? 1 : -1),
        radius: 110 + i * 15,
        color: i % 2 === 0 ? "rgba(6, 182, 212, 0.4)" : "rgba(34, 211, 238, 0.3)",
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Pulse calculations based on state
      pulseAngle += status === "listening" ? 0.15 : status === "processing" ? 0.25 : 0.03;
      const pulseFactor = 1 + Math.sin(pulseAngle) * (status === "listening" ? 0.15 : status === "processing" ? 0.05 : 0.03);

      // Color mapping based on status
      let coreColor = "rgba(6, 182, 212, 1)"; // Cyan
      let glowColor = "rgba(6, 182, 212, 0.5)";
      let particleColor = "cyan";

      if (status === "listening") {
        coreColor = "rgba(234, 179, 8, 1)"; // Golden Yellow
        glowColor = "rgba(234, 179, 8, 0.5)";
        particleColor = "gold";
      } else if (status === "processing") {
        coreColor = "rgba(168, 85, 247, 1)"; // Purple/Magenta
        glowColor = "rgba(168, 85, 247, 0.5)";
        particleColor = "#d946ef";
      } else if (status === "alert") {
        coreColor = "rgba(239, 68, 68, 1)"; // Crimson Red
        glowColor = "rgba(239, 68, 68, 0.5)";
        particleColor = "#ef4444";
      }

      // Base matrix rotation speeds
      if (status === "processing") {
        angleX += 0.02;
        angleY += 0.035;
      } else if (status === "listening") {
        angleX += 0.005;
        angleY += 0.015;
      } else {
        angleX += 0.004;
        angleY += 0.008;
      }

      const radX = angleX;
      const radY = angleY;

      // 1. Draw outer glowing ambient circles (grid-aligned holograms)
      ctx.save();
      ctx.translate(cx, cy);

      // Radial base gradient glowing
      const radialGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 80 * pulseFactor);
      radialGrad.addColorStop(0, glowColor.replace("0.5", "0.2"));
      radialGrad.addColorStop(0.5, glowColor.replace("0.5", "0.08"));
      radialGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 100 * pulseFactor, 0, Math.PI * 2);
      ctx.fill();

      // Outer HUD rings
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;

      // Ring index rotations (tilt effect for holographic projection)
      for (let i = 0; i < ringNodes.length; i++) {
        const ring = ringNodes[i];
        ring.angle += ring.speed;

        ctx.strokeStyle = ring.color;
        ctx.beginPath();
        // Draw slightly tilted ellipses to give a 3D overlay feel
        ctx.ellipse(0, 0, ring.radius * pulseFactor, (ring.radius * 0.45) * pulseFactor, i * 45 * Math.PI / 180, 0, Math.PI * 2);
        ctx.stroke();

        // Orbit nodes matching orbit lines
        const nodeX = Math.cos(ring.angle) * ring.radius * pulseFactor;
        const nodeY = Math.sin(ring.angle) * (ring.radius * 0.45) * pulseFactor;

        // Custom rotate nodeX/nodeY based on rotation tilt matching the ellipse
        const rotAngle = i * 45 * Math.PI / 180;
        const rx = nodeX * Math.cos(rotAngle) - nodeY * Math.sin(rotAngle);
        const ry = nodeX * Math.sin(rotAngle) + nodeY * Math.cos(rotAngle);

        ctx.fillStyle = coreColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = coreColor;
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Visual digital alignment markers on outer rings
        ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx * 1.15, ry * 1.15);
        ctx.stroke();
      }

      ctx.restore();

      // 2. Project 3D Sphere Particles
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      const projected: { x2d: number; y2d: number; depth: number; size: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D rotation equations
        // Rotate around Y
        let x1 = p.x3d * cosY - p.z3d * sinY;
        let z1 = p.x3d * sinY + p.z3d * cosY;

        // Rotate around X
        let y2 = p.y3d * cosX - z1 * sinX;
        let z2 = p.y3d * sinX + z1 * cosX;

        // Projection
        const scale = 220 / (220 + z2); // perspective calculation
        const px = cx + x1 * scale * pulseFactor;
        const py = cy + y2 * scale * pulseFactor;

        projected.push({
          x2d: px,
          y2d: py,
          depth: z2,
          size: p.size * scale * (1.1 + Math.sin(pulseAngle + p.phase) * 0.1),
        });
      }

      // Sort by depth (painters algorithm) to get realistic overlap
      projected.sort((a, b) => b.depth - a.depth);

      // Outer sphere boundary line
      ctx.strokeStyle = glowColor.replace("0.5", "0.15");
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 60 * pulseFactor, 0, Math.PI * 2);
      ctx.stroke();

      // Draw projected lines (Constellation neural network effect matches)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        // Connect nearby points to form neural grid
        let connections = 0;
        for (let j = i + 1; j < projected.length && connections < 3; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x2d - p2.x2d, p1.y2d - p2.y2d);
          if (dist < 45 * pulseFactor) {
            ctx.strokeStyle = `rgba(${status === "listening" ? "234, 179, 8" : status === "processing" ? "168, 85, 247" : status === "alert" ? "239, 68, 68" : "6, 182, 212"}, ${(1 - dist / (45 * pulseFactor)) * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw points with deep shadows
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.max(0.1, Math.min(1, (120 - p.depth) / 180)); // opacity by depth
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        const ptRadius = p.size;
        ctx.arc(p.x2d, p.y2d, ptRadius, 0, Math.PI * 2);
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Inner Core Glow Orb of Jarvis
      ctx.save();
      ctx.translate(cx, cy);
      const innerRadius = (status === "processing" ? 22 : 18) * pulseFactor;
      const innerGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, innerRadius);
      innerGrad.addColorStop(0, coreColor);
      innerGrad.addColorStop(0.3, coreColor.replace("1)", "0.8"));
      innerGrad.addColorStop(0.7, coreColor.replace("1)", "0.2"));
      innerGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Center glowing particle
      ctx.shadowBlur = 15;
      ctx.shadowColor = coreColor;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [status, size]);

  return (
    <div className="relative flex items-center justify-center select-none group cursor-pointer" onClick={onCoreClick}>
      {/* Outer ambient pulsing lights */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-700 opacity-20 filter blur-3xl ${
          status === "listening"
            ? "bg-yellow-500 w-80 h-80"
            : status === "processing"
            ? "bg-fuchsia-500 w-80 h-80"
            : status === "alert"
            ? "bg-red-500 w-80 h-80"
            : "bg-cyan-500 w-80 h-80 group-hover:opacity-30"
        }`}
      />

      {/* Futuristic digital scanner target overlay */}
      <div className="absolute inset-0 pointer-events-none border border-cyan-500/10 rounded-full scale-105 animate-[spin_40s_linear_infinite]" />
      <div className="absolute inset-2 pointer-events-none border-t border-b border-cyan-500/20 rounded-full scale-100 animate-[spin_15s_linear_infinite_reverse]" />

      <canvas ref={canvasRef} className="relative z-10 transition-transform duration-300 group-hover:scale-105" />

      {/* Core status badge overlay */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-black/80 border border-cyan-500/30 rounded-full text-[10px] font-mono tracking-widest text-cyan-400">
        <span
          className={`w-1.5 h-1.5 rounded-full inline-block ${
            status === "listening"
              ? "bg-yellow-400 animate-ping"
              : status === "processing"
              ? "bg-fuchsia-400 animate-pulse"
              : status === "alert"
              ? "bg-red-500 animate-pulse"
              : "bg-cyan-400 animate-pulse"
          }`}
        />
        {status.toUpperCase()} CORE
      </div>
    </div>
  );
}
