"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Gear teeth path generator ───────────────────────────────────────────────
function gearPath(
  cx: number, cy: number,
  innerR: number, outerR: number,
  teeth: number,
  toothWidth = 0.55
): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const angle1 = (i / teeth) * Math.PI * 2;
    const angle2 = ((i + toothWidth) / teeth) * Math.PI * 2;
    const angle3 = ((i + toothWidth + (1 - toothWidth) * 0.1) / teeth) * Math.PI * 2;
    const angle4 = ((i + 1 - (1 - toothWidth) * 0.1) / teeth) * Math.PI * 2;
    pts.push(
      `${cx + Math.cos(angle1) * innerR},${cy + Math.sin(angle1) * innerR}`,
      `${cx + Math.cos(angle1) * outerR},${cy + Math.sin(angle1) * outerR}`,
      `${cx + Math.cos(angle2) * outerR},${cy + Math.sin(angle2) * outerR}`,
      `${cx + Math.cos(angle3) * innerR},${cy + Math.sin(angle3) * innerR}`,
      `${cx + Math.cos(angle4) * innerR},${cy + Math.sin(angle4) * innerR}`
    );
  }
  return `M ${pts.join(" L ")} Z`;
}

// ─── Spoke ring path ─────────────────────────────────────────────────────────
function spokePath(cx: number, cy: number, r1: number, r2: number, spokes: number): string {
  const d: string[] = [];
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    d.push(`M ${cx + Math.cos(a) * r1} ${cy + Math.sin(a) * r1} L ${cx + Math.cos(a) * r2} ${cy + Math.sin(a) * r2}`);
  }
  return d.join(" ");
}

// ─── Circuit line path ───────────────────────────────────────────────────────
function circuitLines(cx: number, cy: number, count: number, r: number): string {
  const d: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const midR = r * 0.55;
    const x0 = cx + Math.cos(a) * midR;
    const y0 = cy + Math.sin(a) * midR;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    // Elbow bend
    const xM = cx + Math.cos(a + 0.18) * (midR * 1.2);
    const yM = cy + Math.sin(a + 0.18) * (midR * 1.2);
    d.push(`M ${x0} ${y0} Q ${xM} ${yM} ${x1} ${y1}`);
  }
  return d.join(" ");
}

// ─── Floating Particle ───────────────────────────────────────────────────────
function Particle({ cx, cy, r, delay }: { cx: number; cy: number; r: number; delay: number }) {
  const angle = Math.random() * Math.PI * 2;
  const dist = r * (0.6 + Math.random() * 0.8);
  const x = cx + Math.cos(angle) * dist;
  const y = cy + Math.sin(angle) * dist;
  const size = 1.5 + Math.random() * 2;

  return (
    <motion.circle
      cx={x} cy={y} r={size}
      fill="#ff3320"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.6, 0],
        scale: [0, 1, 1.4, 0],
        cx: [x, x + (Math.random() - 0.5) * 20, x + (Math.random() - 0.5) * 40],
        cy: [y, y - 15 - Math.random() * 20, y - 40 - Math.random() * 30],
      }}
      transition={{
        duration: 2.5 + Math.random() * 2,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
      style={{ filter: "drop-shadow(0 0 4px #ff3320)" }}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
interface MechanicalCoreProps {
  onEnter?: () => void;
  visible?: boolean;
}

export default function MechanicalCore({ onEnter, visible = true }: MechanicalCoreProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Pulse counter for energy wave rings
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => p + 1), 1800);
    return () => clearInterval(interval);
  }, []);

  const CX = 250, CY = 250, SVGW = 500;

  const particles = Array.from({ length: 18 }, (_, i) => ({
    key: i,
    delay: i * 0.18,
  }));

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => onEnter?.(), 700);
  };

  // Pulse rings – spawn every 1.8s
  const pulseKeys = [0, 1, 2].map(i => pulse - i).filter(k => k >= 0);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center select-none"
          style={{ cursor: "pointer" }}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Outer ambient glow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 340, height: 340,
              background: "radial-gradient(circle, rgba(220,40,20,0.18) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg
            width={SVGW} height={SVGW}
            viewBox={`0 0 ${SVGW} ${SVGW}`}
            style={{ overflow: "visible" }}
          >
            <defs>
              {/* Red neon glow filter */}
              <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Metal gradient */}
              <radialGradient id="metalGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#5a4a40" />
                <stop offset="40%" stopColor="#2a1e1a" />
                <stop offset="100%" stopColor="#0d0807" />
              </radialGradient>
              <radialGradient id="metalGrad2" cx="60%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#4a3028" />
                <stop offset="50%" stopColor="#1a100c" />
                <stop offset="100%" stopColor="#0a0604" />
              </radialGradient>
              <radialGradient id="orbGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#ff6040" />
                <stop offset="45%" stopColor="#cc1500" />
                <stop offset="100%" stopColor="#400500" />
              </radialGradient>
              <radialGradient id="orbShine" cx="30%" cy="25%" r="50%">
                <stop offset="0%" stopColor="rgba(255,200,180,0.5)" />
                <stop offset="100%" stopColor="rgba(255,80,40,0)" />
              </radialGradient>

              {/* Circuit dash animation */}
              <style>{`
                @keyframes dashFlow {
                  from { stroke-dashoffset: 200; }
                  to   { stroke-dashoffset: 0; }
                }
                @keyframes orbPulse {
                  0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 12px #ff3320) drop-shadow(0 0 30px #ff1500); }
                  50% { opacity: 1; filter: drop-shadow(0 0 20px #ff5040) drop-shadow(0 0 50px #ff2000); }
                }
                @keyframes lightReflect {
                  0%   { opacity: 0.0; transform: rotate(-30deg); }
                  20%  { opacity: 0.18; }
                  50%  { opacity: 0.06; }
                  80%  { opacity: 0.22; }
                  100% { opacity: 0.0; transform: rotate(30deg); }
                }
                @keyframes rotCW  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
                @keyframes rotCCW { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
                @keyframes kpulse { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
                .rot-cw-slow  { animation: rotCW  18s linear infinite; transform-origin: 250px 250px; }
                .rot-ccw-med  { animation: rotCCW 12s linear infinite; transform-origin: 250px 250px; }
                .rot-cw-fast  { animation: rotCW   8s linear infinite; transform-origin: 250px 250px; }
                .rot-ccw-fast { animation: rotCCW  6s linear infinite; transform-origin: 250px 250px; }
                .rot-cw-vfast { animation: rotCW   4s linear infinite; transform-origin: 250px 250px; }
                .rot-orb      { animation: orbPulse 2.5s ease-in-out infinite; }
                .circuit-flow { animation: dashFlow 2s linear infinite; }
                .light-sweep  { animation: lightReflect 4s ease-in-out infinite; transform-origin: 250px 250px; }
              `}</style>
            </defs>

            {/* ── Energy pulse rings (spawned periodically) ── */}
            {pulseKeys.map(k => (
              <motion.circle
                key={k}
                cx={CX} cy={CY}
                r={60}
                fill="none"
                stroke="#ff3320"
                strokeWidth="1.5"
                initial={{ r: 60, opacity: 0.8, strokeWidth: 2 }}
                animate={{ r: 230, opacity: 0, strokeWidth: 0.3 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 6px #ff3320)" }}
              />
            ))}

            {/* ── Layer 1: Dark background disc ── */}
            <circle cx={CX} cy={CY} r={230} fill="url(#metalGrad)" />
            <circle cx={CX} cy={CY} r={228} fill="none" stroke="#3a2018" strokeWidth="1.5" />

            {/* ── Layer 2: Outer GEAR RING (rotates CW slowly) ── */}
            <g className="rot-cw-slow">
              <path
                d={gearPath(CX, CY, 195, 228, 36, 0.58)}
                fill="url(#metalGrad2)"
                stroke="#7a4030"
                strokeWidth="0.8"
              />
              {/* Neon rim on gear tips */}
              <path
                d={gearPath(CX, CY, 195, 228, 36, 0.58)}
                fill="none"
                stroke="#ff3320"
                strokeWidth="0.6"
                opacity="0.5"
                filter="url(#softGlow)"
              />
              {/* Inner circle of outer gear */}
              <circle cx={CX} cy={CY} r={194} fill="none" stroke="#ff3320" strokeWidth="0.8" opacity="0.4" filter="url(#softGlow)" />
            </g>

            {/* ── KRISH BOHRA PORTFOLIO arc text (bottom, on outer ring) ── */}
            <defs>
              <path id="bottomArc" d={`M ${CX - 175} ${CY} A 175 175 0 0 0 ${CX + 175} ${CY}`} />
              <path id="topArc"    d={`M ${CX - 175} ${CY} A 175 175 0 0 1 ${CX + 175} ${CY}`} />
            </defs>
            <text
              fontFamily="'Courier New', monospace"
              fontSize="11"
              fontWeight="700"
              letterSpacing="5"
              fill="#cc3010"
              filter="url(#softGlow)"
            >
              <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                KRISH BOHRA PORTFOLIO
              </textPath>
            </text>

            {/* ── Layer 3: Mid ring (rotates CCW) ── */}
            <g className="rot-ccw-med">
              <path
                d={gearPath(CX, CY, 152, 180, 24, 0.52)}
                fill="#1a0f09"
                stroke="#5a2a18"
                strokeWidth="1"
              />
              <path
                d={gearPath(CX, CY, 152, 180, 24, 0.52)}
                fill="none"
                stroke="#ff3320"
                strokeWidth="0.7"
                opacity="0.45"
                filter="url(#softGlow)"
              />
              {/* Spoke ring inside */}
              <path
                d={spokePath(CX, CY, 120, 150, 12)}
                fill="none"
                stroke="#4a2010"
                strokeWidth="2"
              />
              <path
                d={spokePath(CX, CY, 120, 150, 12)}
                fill="none"
                stroke="#ff3320"
                strokeWidth="0.6"
                opacity="0.35"
                filter="url(#softGlow)"
              />
            </g>

            {/* ── Layer 4: Circuit board ring ── */}
            <g className="rot-cw-fast">
              <circle cx={CX} cy={CY} r={120} fill="#110a07" stroke="#3a1a0e" strokeWidth="1" />
              {/* Circuit lines */}
              <path
                d={circuitLines(CX, CY, 16, 115)}
                fill="none"
                stroke="#ff3320"
                strokeWidth="0.9"
                strokeDasharray="8 4"
                opacity="0.7"
                className="circuit-flow"
                filter="url(#softGlow)"
              />
              {/* Small bolt circles */}
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={CX + Math.cos(a) * 110}
                    cy={CY + Math.sin(a) * 110}
                    r={3.5}
                    fill="#2a1208"
                    stroke="#ff3320"
                    strokeWidth="0.8"
                    opacity="0.9"
                    filter="url(#softGlow)"
                  />
                );
              })}
            </g>

            {/* ── Layer 5: Inner gear (CCW fast) ── */}
            <g className="rot-ccw-fast">
              <path
                d={gearPath(CX, CY, 78, 102, 16, 0.55)}
                fill="#0e0806"
                stroke="#6a3010"
                strokeWidth="1.2"
              />
              <path
                d={gearPath(CX, CY, 78, 102, 16, 0.55)}
                fill="none"
                stroke="#ff3320"
                strokeWidth="0.9"
                opacity="0.55"
                filter="url(#softGlow)"
              />
              {/* Cross pattern */}
              {[0, 90, 180, 270].map(deg => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line
                    key={deg}
                    x1={CX + Math.cos(rad) * 40}
                    y1={CY + Math.sin(rad) * 40}
                    x2={CX + Math.cos(rad) * 75}
                    y2={CY + Math.sin(rad) * 75}
                    stroke="#ff3320"
                    strokeWidth="1.2"
                    opacity="0.5"
                    filter="url(#softGlow)"
                  />
                );
              })}
            </g>

            {/* ── Layer 6: Innermost mini gear (CW vfast) ── */}
            <g className="rot-cw-vfast">
              <path
                d={gearPath(CX, CY, 44, 60, 10, 0.5)}
                fill="#0d0705"
                stroke="#8a3a18"
                strokeWidth="1.5"
              />
              <path
                d={gearPath(CX, CY, 44, 60, 10, 0.5)}
                fill="none"
                stroke="#ff4020"
                strokeWidth="1"
                opacity="0.7"
                filter="url(#softGlow)"
              />
            </g>

            {/* ── Layer 7: Central orb ── */}
            <circle cx={CX} cy={CY} r={40} fill="#050201" />
            <circle
              cx={CX} cy={CY} r={38}
              fill="url(#orbGrad)"
              className="rot-orb"
              filter="url(#strongGlow)"
            />
            {/* Orb shine specular */}
            <circle
              cx={CX} cy={CY} r={38}
              fill="url(#orbShine)"
            />
            {/* Orb rim */}
            <circle cx={CX} cy={CY} r={38} fill="none" stroke="#ff5030" strokeWidth="1.5" opacity="0.9" filter="url(#softGlow)" />

            {/* ── "krish" neon handwritten-style text ── */}
            <text
              x={CX} y={CY + 7}
              textAnchor="middle"
              fontFamily="'Dancing Script', 'Brush Script MT', cursive"
              fontSize="22"
              fontWeight="700"
              fill="#ff6a50"
              filter="url(#strongGlow)"
              style={{ animation: "orbPulse 2.5s ease-in-out infinite" }}
            >
              krish
            </text>

            {/* ── Metallic light sweep across outer ring ── */}
            <ellipse
              cx={CX - 60} cy={CY - 80}
              rx={60} ry={180}
              fill="rgba(255,200,160,0.07)"
              className="light-sweep"
            />

            {/* ── Floating sparks / particles ── */}
            {particles.map(p => (
              <Particle key={p.key} cx={CX} cy={CY} r={220} delay={p.delay} />
            ))}

            {/* ── Hover: outer neon highlight ring ── */}
            <motion.circle
              cx={CX} cy={CY} r={228}
              fill="none"
              stroke="#ff3320"
              strokeWidth="2"
              animate={{ opacity: hovered ? 1 : 0.2 }}
              transition={{ duration: 0.4 }}
              filter="url(#redGlow)"
            />
          </svg>

          {/* Click CTA label beneath (pulses) */}
          <motion.p
            className="mt-[-28px] text-[10px] font-bold tracking-[0.4em] uppercase text-red-500/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ textShadow: "0 0 8px rgba(255,50,20,0.6)" }}
          >
            {clicked ? "Entering..." : "Click to Enter"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
