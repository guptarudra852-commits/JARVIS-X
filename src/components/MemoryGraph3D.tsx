import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { MemoryCard } from "../types";
import { Zap, Network, Activity, HelpCircle, Expand, Sparkles, Filter } from "lucide-react";

interface NodeState {
  id: string;
  title: string;
  category: string;
  content: string;
  relevance: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

interface EdgeState {
  source: string;
  target: string;
  strength: number;
}

interface GraphSceneProps {
  memories: MemoryCard[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  searchTerm: string;
  filterCategory: string;
  repulsion: number;
  attraction: number;
  gravity: number;
  showLabels: boolean;
}

// Category design mapping
export const CATEGORY_COLORS: Record<string, { hex: string; bg: string; text: string; border: string }> = {
  preference: { hex: "#10b981", bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  task: { hex: "#ef4444", bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/30" },
  system: { hex: "#06b6d4", bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
  personal: { hex: "#fbbf24", bg: "bg-amber-500/20", text: "text-amber-450", border: "border-amber-500/30" },
  default: { hex: "#a78bfa", bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};

function GraphPhysicsScene({
  memories,
  selectedNodeId,
  onSelectNode,
  searchTerm,
  filterCategory,
  repulsion,
  attraction,
  gravity,
  showLabels,
}: GraphSceneProps) {
  const { camera } = useThree();
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [edges, setEdges] = useState<EdgeState[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Maintain position refs persistently across component re-renders to prevent sudden resets
  const nodePhysicsRef = useRef<Map<string, { x: number; y: number; z: number; vx: number; vy: number; vz: number }>>(
    new Map()
  );

  // Synchronize memory cards with local physics nodes
  useEffect(() => {
    const updatedMap = new Map<string, { x: number; y: number; z: number; vx: number; vy: number; vz: number }>();
    
    // 1. Maintain old node positions or spawn new ones at randomized center offsets
    memories.forEach((mem) => {
      const existing = nodePhysicsRef.current.get(mem.id);
      if (existing) {
        updatedMap.set(mem.id, existing);
      } else {
        // Spread around origin in a small cloud
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 0.5 + Math.random() * 1.5;
        updatedMap.set(mem.id, {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
          vx: 0,
          vy: 0,
          vz: 0,
        });
      }
    });

    nodePhysicsRef.current = updatedMap;

    // 2. Compute connections (Edges) automatically based on semantic categories and keywords similarity
    const newEdges: EdgeState[] = [];
    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const m1 = memories[i];
        const m2 = memories[j];

        let strength = 0;
        // Connect same category with high affinity
        if (m1.category === m2.category) {
          strength += 0.4;
        }

        // Shared keyword token correlation
        const words1 = new Set(m1.content.toLowerCase().split(/\W+/).filter(w => w.length > 4));
        const words2 = new Set(m2.content.toLowerCase().split(/\W+/).filter(w => w.length > 4));
        const titleWords1 = m1.title.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const titleWords2 = m2.title.toLowerCase().split(/\W+/).filter(w => w.length > 3);

        titleWords1.forEach(tw => words1.add(tw));
        titleWords2.forEach(tw => words2.add(tw));

        let sharedCount = 0;
        words1.forEach(word => {
          if (words2.has(word)) sharedCount++;
        });

        if (sharedCount > 0) {
          strength += sharedCount * 0.3;
        }

        // Always create a base structure if no other linkages exist to avoid isolated space grids
        if (strength > 0 || (i === 0 && j === 1) || (i === 1 && j === 2) || (i === 2 && j === 3) || (i === 0 && j === 3)) {
          newEdges.push({
            source: m1.id,
            target: m2.id,
            strength: Math.min(strength || 0.2, 1.2),
          });
        }
      }
    }

    setEdges(newEdges);
  }, [memories]);

  // Clean objects from scan serializer
  useMemo(() => {
    if (nodePhysicsRef && !Object.prototype.hasOwnProperty.call(nodePhysicsRef, "toJSON")) {
      Object.defineProperty(nodePhysicsRef, "toJSON", { value: () => "[PhysicsRef]", enumerable: false, configurable: true });
    }
  }, []);

  // Solve N-body spring layout interactive physics frame-by-frame
  useFrame((state) => {
    const activePhysics = nodePhysicsRef.current;
    if (activePhysics.size === 0) return;

    const ids = Array.from(activePhysics.keys());

    // 1. Repulsive forces (Coulomb's Law representation - separates nodes to prevent collision)
    const kRepulsion = repulsion * 0.01;
    for (let i = 0; i < ids.length; i++) {
      const id1 = ids[i];
      const p1 = activePhysics.get(id1)!;

      for (let j = i + 1; j < ids.length; j++) {
        const id2 = ids[j];
        const p2 = activePhysics.get(id2)!;

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let dz = p2.z - p1.z;

        // Prevent exact overlap division by zero
        if (dx === 0 && dy === 0 && dz === 0) {
          dx = 0.05 * (Math.random() - 0.5);
          dy = 0.05 * (Math.random() - 0.5);
          dz = 0.05 * (Math.random() - 0.5);
        }

        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq);

        // Repulsion is inversely proportional to distance
        const force = kRepulsion / (distSq + 0.1);
        const fx = force * (dx / (dist || 1));
        const fy = force * (dy / (dist || 1));
        const fz = force * (dz / (dist || 1));

        p1.vx -= fx;
        p1.vy -= fy;
        p1.vz -= fz;

        p2.vx += fx;
        p2.vy += fy;
        p2.vz += fz;
      }
    }

    // 2. Attraction Forces (Hooke's Spring Law along conceptual links)
    const kAttr = attraction * 0.005;
    const restLength = 2.0;

    edges.forEach((edge) => {
      const p1 = activePhysics.get(edge.source);
      const p2 = activePhysics.get(edge.target);

      if (!p1 || !p2) return;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dz = p2.z - p1.z;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;

      // Spring displacement force
      const stretch = dist - restLength;
      const force = stretch * kAttr * edge.strength;

      const fx = force * (dx / dist);
      const fy = force * (dy / dist);
      const fz = force * (dz / dist);

      p1.vx += fx;
      p1.vy += fy;
      p1.vz += fz;

      p2.vx -= fx;
      p2.vy -= fy;
      p2.vz -= fz;
    });

    // 3. Gravity & Center-Centering gravity pull
    const kGravity = gravity * 0.002;
    ids.forEach((id) => {
      const p = activePhysics.get(id)!;
      p.vx -= p.x * kGravity;
      p.vy -= p.y * kGravity;
      p.vz -= p.z * kGravity;
    });

    // 4. Position integrate step and speed friction decay
    const friction = 0.88;
    const maxVelocity = 0.5;

    ids.forEach((id) => {
      const p = activePhysics.get(id)!;
      
      // Speed governor limit
      p.vx = THREE.MathUtils.clamp(p.vx, -maxVelocity, maxVelocity);
      p.vy = THREE.MathUtils.clamp(p.vy, -maxVelocity, maxVelocity);
      p.vz = THREE.MathUtils.clamp(p.vz, -maxVelocity, maxVelocity);

      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      p.vx *= friction;
      p.vy *= friction;
      p.vz *= friction;
    });

    // 5. Update React states to trigger rendering changes gracefully
    const currentNodes: NodeState[] = memories.map((mem) => {
      const p = activePhysics.get(mem.id) || { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 };
      return {
        ...mem,
        x: p.x,
        y: p.y,
        z: p.z,
        vx: p.vx,
        vy: p.vy,
        vz: p.vz,
      };
    });

    setNodes(currentNodes);
  });

  // Calculate coordinates array for Line matching
  const lineSegments = useMemo(() => {
    const segments: Array<{ 
      start: [number, number, number]; 
      end: [number, number, number]; 
      isMatching: boolean; 
      strength: number;
      key: string; 
    }> = [];
    
    edges.forEach((edge) => {
      const n1 = nodes.find((n) => n.id === edge.source);
      const n2 = nodes.find((n) => n.id === edge.target);

      if (n1 && n2) {
        // Check if related to selected or hovered concepts for highlighting
        const isHighlight =
          edge.source === selectedNodeId ||
          edge.target === selectedNodeId ||
          edge.source === hoveredNodeId ||
          edge.target === hoveredNodeId;

        segments.push({
          start: [n1.x, n1.y, n1.z],
          end: [n2.x, n2.y, n2.z],
          isMatching: isHighlight,
          strength: edge.strength,
          key: `${edge.source}-${edge.target}`,
        });
      }
    });

    return segments;
  }, [edges, nodes, selectedNodeId, hoveredNodeId]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />

      {/* RENDER NETWORK EDGE LINES */}
      {lineSegments.map((seg) => (
        <LineWidget
          key={seg.key}
          start={seg.start}
          end={seg.end}
          highlight={seg.isMatching}
          strength={seg.strength}
        />
      ))}

      {/* RENDER NODES CONCEPT SPHERES */}
      {nodes.map((node) => {
        const isSelected = node.id === selectedNodeId;
        const isHovered = node.id === hoveredNodeId;
        const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.default;
        
        // Match user search term
        const isMuted =
          (searchTerm &&
            !node.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !node.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (filterCategory !== "all" && node.category !== filterCategory);

        return (
          <NodeWidget
            key={node.id}
            node={node}
            isSelected={isSelected}
            isHovered={isHovered}
            isMuted={isMuted}
            colors={colors}
            showLabels={showLabels}
            onSelectNode={onSelectNode}
            onHover={setHoveredNodeId}
            selectedNodeId={selectedNodeId}
          />
        );
      })}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={12}
      />
    </>
  );
}

// Custom responsive widget representing each cognitive node in 3D Space
interface NodeWidgetProps {
  node: NodeState;
  isSelected: boolean;
  isHovered: boolean;
  isMuted: boolean;
  colors: { hex: string; bg: string; text: string; border: string };
  showLabels: boolean;
  onSelectNode: (id: string | null) => void;
  onHover: (id: string | null) => void;
  selectedNodeId: string | null;
}

function NodeWidget({
  node,
  isSelected,
  isHovered,
  isMuted,
  colors,
  showLabels,
  onSelectNode,
  onHover,
  selectedNodeId,
}: NodeWidgetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1.0);

  // Smooth hover and selection expansion with beautiful physical breathing pulses
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Responsive target scale expands on click and subtle hover
    const targetScale = isSelected ? 1.85 : isHovered ? 1.4 : 1.0;
    
    // Smooth frame-by-frame interpolation
    scaleRef.current += (targetScale - scaleRef.current) * 0.18;

    let finalScale = scaleRef.current;
    
    // Inject elegant mathematical pulsing based on selected or hovered mode
    if (isSelected) {
      // Rapid holographic high-energy breath pulse (expands/contracts responsive to click)
      finalScale += Math.sin(t * 8.2) * 0.12;
    } else if (isHovered) {
      // Gentle calm orbital hover drift pulse
      finalScale += Math.sin(t * 4.0) * 0.04;
    }

    meshRef.current.scale.set(finalScale, finalScale, finalScale);

    // Halo ring gets separate responsive expanding sweep pulse
    if (ringRef.current) {
      const ringBase = isSelected ? 1.35 : 1.0;
      const ringPulse = ringBase + Math.sin(t * 4.8) * (isSelected ? 0.22 : 0.08);
      ringRef.current.scale.set(ringPulse, ringPulse, 1);
    }
  });

  return (
    <group
      position={[node.x, node.y, node.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode(node.id === selectedNodeId ? null : node.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* Core glowing orb sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial
          color={colors.hex}
          emissive={colors.hex}
          emissiveIntensity={isSelected ? 4.8 : isHovered ? 2.8 : isMuted ? 0.35 : 1.6}
          transparent
          opacity={isMuted ? 0.22 : 1.0}
        />
      </mesh>

      {/* Glowing outer halo ring */}
      {(isSelected || isHovered) && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.22, 0.28, 32]} />
          <meshBasicMaterial
            color={colors.hex}
            transparent
            opacity={isSelected ? 0.95 : 0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Real-time HTML Overlays on 3D coordinates */}
      {showLabels && (!isMuted || isHovered) && (
        <Html
          distanceFactor={7.5}
          position={[0, 0.35, 0]}
          center
          pointerEvents="none"
        >
          <div
            className={`px-2.5 py-1 rounded backdrop-blur-md border text-[9px] font-mono leading-none flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 pointer-events-auto cursor-pointer ${
              isSelected
                ? `bg-black/95 ${colors.border} ${colors.text} shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-110 font-bold border-cyan-400`
                : isHovered
                ? `bg-black/85 ${colors.border} ${colors.text} scale-105 border-white/45`
                : "bg-black/60 border-cyan-500/20 text-slate-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode(node.id === selectedNodeId ? null : node.id);
            }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} style={{ backgroundColor: colors.hex }} />
            <span className="max-w-[110px] truncate">{node.title}</span>
            <span className="text-[7px] text-gray-500">({node.relevance}%)</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// Custom widget to render glowing connector lines cleanly
function LineWidget({ 
  start, 
  end, 
  highlight, 
  strength = 1.0 
}: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  highlight: boolean; 
  strength?: number;
}) {
  const lineRef = useRef<THREE.Line>(null!);

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.geometry.setFromPoints(points);
    }
  }, [points]);

  return (
    <line ref={lineRef as any}>
      <bufferGeometry />
      <lineBasicMaterial
        color={highlight ? "#06b6d4" : "#1e293b"}
        transparent
        opacity={highlight ? 0.95 : 0.16}
        linewidth={(highlight ? 2 : 1) * strength}
      />
    </line>
  );
}

export default function MemoryGraph3D({
  memories,
  searchTerm = "",
  filterCategory = "all",
  onSelectNodeInList,
}: {
  memories: MemoryCard[];
  searchTerm?: string;
  filterCategory?: string;
  onSelectNodeInList?: (id: string | null) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Interactive force slider variables
  const [repulsion, setRepulsion] = useState(45);
  const [attraction, setAttraction] = useState(30);
  const [gravity, setGravity] = useState(25);
  const [showLabels, setShowLabels] = useState(true);

  // Selected memory details lookup
  const selectedMemory = useMemo(() => {
    return memories.find((m) => m.id === selectedId) || null;
  }, [memories, selectedId]);

  const handleSelectNode = (id: string | null) => {
    setSelectedId(id);
    if (onSelectNodeInList) {
      onSelectNodeInList(id);
    }
  };

  return (
    <div className="w-full bg-black/40 border border-cyan-500/15 rounded-2xl relative overflow-hidden flex flex-col min-h-[460px] md:min-h-[520px] transition-all group">
      
      {/* Background neon ambient color bleed */}
      <div className="absolute inset-0 bg-cyan-950/5 pointer-events-none" />
      
      {/* Dynamic Graph Readout Header */}
      <div className="p-4 border-b border-cyan-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0a141d]/85 backdrop-blur-md z-1">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-cyan-400 shrink-0 animate-pulse" />
          <div>
            <h3 className="font-mono text-xs font-bold text-white tracking-widest uppercase">Cognitive Symbiosis Map (3D)</h3>
            <p className="text-[8px] font-mono text-slate-400">COULOMBIAN FORCE-DIRECTED VECTOR CONCEPT LINKAGES</p>
          </div>
        </div>

        {/* Realtime status indicators */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[8px]">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/30 border border-cyan-500/10 text-cyan-300">
            <Activity size={10} className="animate-bounce" /> Physics: Active
          </span>
          <span className="px-2 py-0.5 rounded bg-black/30 border border-cyan-500/10 text-slate-300">
            Nodes: {memories.length}
          </span>
          <button
            onClick={() => {
              // Reset physics model positions
              setRepulsion(45);
              setAttraction(30);
              setGravity(25);
            }}
            className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black cursor-pointer transition-all"
            title="Reset spatial forces parameters"
          >
            RESET_FIELDS
          </button>
        </div>
      </div>

      {/* Main Container dividing Canvas and Force Control HUD */}
      <div className="flex-grow relative flex flex-col md:flex-row">
        
        {/* RENDER CANVAS CONTAINER */}
        <div id="three-memory-graph-stage" className="flex-grow w-full h-[320px] md:h-auto min-h-[300px] relative">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{ antialias: false }}
          >
            <GraphPhysicsScene
              memories={memories}
              selectedNodeId={selectedId}
              onSelectNode={handleSelectNode}
              searchTerm={searchTerm}
              filterCategory={filterCategory}
              repulsion={repulsion}
              attraction={attraction}
              gravity={gravity}
              showLabels={showLabels}
            />
          </Canvas>

          {/* Quick HUD guide controls in canvas corner */}
          <div className="absolute bottom-3 left-4 flex flex-col gap-1 pointer-events-none select-none font-mono text-[8px] text-slate-500">
            <span>&bull; Left Mouse click & Drag to Orbit Camera</span>
            <span>&bull; Right Mouse / Shift Drag to Pan Scene</span>
            <span>&bull; Mouse Scroll wheel to Zoom Coordinates</span>
            <span>&bull; Click any sphere or label to view detail</span>
          </div>

          {/* Floating diagnostic detail readouts */}
          {selectedMemory && (
            <div className="absolute top-4 right-4 max-w-xs sm:max-w-sm bg-[#091016]/95 border border-cyan-400/40 rounded-xl p-4 shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md z-10 animate-fade-in font-sans">
              <div className="flex items-start justify-between border-b border-cyan-500/20 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">{selectedMemory.title}</span>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-gray-400 hover:text-red-400 text-xs font-mono font-bold cursor-pointer"
                >
                  [X]
                </button>
              </div>

              <div className="text-[10px] text-slate-300 leading-relaxed max-h-24 overflow-y-auto mb-2 pr-1">
                {selectedMemory.content}
              </div>

              <div className="flex items-center justify-between text-[8px] font-mono text-gray-500 border-t border-cyan-500/10 pt-2">
                <span>CAT: {selectedMemory.category.toUpperCase()}</span>
                <span className="text-cyan-400 font-semibold">RELEVANCE_COEFF: {selectedMemory.relevance}%</span>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS HUD SIDE PANEL */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-cyan-500/15 bg-black/55 backdrop-blur-md p-4 flex flex-col gap-4 shrink-0 justify-between">
          <div className="space-y-4">
            <div className="border-b border-cyan-500/10 pb-2.5">
              <span className="block font-mono text-[9px] text-cyan-400 uppercase tracking-widest font-bold">Vector Field Forces</span>
              <span className="block text-[7px] text-slate-500 mt-0.5">FINE-TUNE N-BODY GRAVITATIONAL REFLUX</span>
            </div>

            {/* Repulsion force factor */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[8px]">
                <span className="text-slate-400 uppercase">Node Separation</span>
                <span className="text-cyan-400 font-bold">{repulsion}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={repulsion}
                onChange={(e) => setRepulsion(parseInt(e.target.value))}
                className="w-full h-1 bg-cyan-950/40 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Attraction elastic factor */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[8px]">
                <span className="text-slate-400 uppercase">Elastic Spring Bond</span>
                <span className="text-cyan-400 font-bold">{attraction}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={attraction}
                onChange={(e) => setAttraction(parseInt(e.target.value))}
                className="w-full h-1 bg-cyan-950/40 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Centrifugal gravity pull */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[8px]">
                <span className="text-slate-400 uppercase">Centroid Gravity</span>
                <span className="text-cyan-400 font-bold">{gravity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={gravity}
                onChange={(e) => setGravity(parseInt(e.target.value))}
                className="w-full h-1 bg-cyan-950/40 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Labels overlay toggle */}
            <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between">
              <span className="font-mono text-[8px] text-slate-400 uppercase uppercase">Show Node Overlays</span>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-2.5 py-1 rounded text-[8px] font-mono border transition-all cursor-pointer ${
                  showLabels
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-300"
                    : "bg-black/30 border-white/10 text-gray-400"
                }`}
              >
                {showLabels ? "VISIBLE" : "HIDDEN"}
              </button>
            </div>
          </div>

          <div className="bg-[#0b1722]/60 border border-cyan-500/10 p-3 rounded-lg space-y-1.5">
            <span className="block font-mono text-[8px] text-slate-400 uppercase tracking-wider font-bold">Nodes Correlation Index:</span>
            <div className="space-y-1 text-[7px] font-mono leading-none">
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> SYSTEM (MAPPED RECON)</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> TASK (FUEL / ALERTS)</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> PREFERENCE (COORDS)</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> PERSONAL (BREWING)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
