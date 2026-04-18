"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowRight, Download, Mail, Headphones, ExternalLink } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

// ─── 3D Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className, style }: { children: React.ReactNode; className: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  // Light reflection position
  const spotX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const spotBg = useMotionTemplate`radial-gradient(circle at ${spotX} ${spotY}, rgba(255,255,255,0.06) 0%, transparent 60%)`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || (typeof window !== 'undefined' && window.innerWidth < 768)) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {/* Mouse-tracked light reflection */}
      <motion.div
        style={{ background: spotBg }}
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-20"
      />
      {/* Shimmer border on hover */}
      <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(100,150,255,0.1) 70%, transparent 100%)",
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── Ripple CTA Button ──────────────────────────────────────────────────────────
function RippleButton({ children, className, onClick }: { children: React.ReactNode; className: string; onClick?: () => void }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    onClick?.();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleClick}
      className={`${className} relative overflow-hidden`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/20 animate-ripple pointer-events-none"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
        />
      ))}
      {children}
    </motion.button>
  );
}

// ─── Glowing Keyword ────────────────────────────────────────────────────────────
function Keyword({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 md:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
      {children}
    </span>
  );
}

// ─── Main Overlay ───────────────────────────────────────────────────────────────
// ─── Main Overlay ───────────────────────────────────────────────────────────────
export default function Overlay() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero is 800vh. We map scroll progress (0 to 1 of entire page)
  // Assuming page is roughly 1200vh total (800 hero + 400 certs/projects/etc).
  // Hero ends at ~0.66 progress.
  // Section 1: Hero (0 -> 0.3)
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const blur1    = useTransform(scrollYProgress, [0, 0.2, 0.3], isMobile ? ["blur(0px)", "blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(0px)", "blur(12px)"]);

  // Section 2: Bio & Edu (0.3 -> 0.7)
  const opacity2 = useTransform(scrollYProgress, [0.32, 0.38, 0.62, 0.68], [0, 1, 1, 0]);
  const blur2    = useTransform(scrollYProgress, [0.32, 0.38, 0.62, 0.68], isMobile ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"] : ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  // Section 3: Philosophy (0.7 -> 1.0)
  const opacity3 = useTransform(scrollYProgress, [0.72, 0.8, 1], [0, 1, 1]);
  const blur3    = useTransform(scrollYProgress, [0.72, 0.8, 1], isMobile ? ["blur(0px)", "blur(0px)", "blur(0px)"] : ["blur(12px)", "blur(0px)", "blur(0px)"]);

  // Y parallax
  const y1 = useTransform(scrollYProgress, [0, 0.3],    isMobile ? [0, -30] : [0, -80]);
  const y2 = useTransform(scrollYProgress, [0.32, 0.68], isMobile ? [30, -30] : [80, -80]);
  const y3 = useTransform(scrollYProgress, [0.72, 1],    [80, 0]);

  // Section 2 staggered elements
  const opacityBio  = useTransform(scrollYProgress, [0.32, 0.4, 0.62, 0.68], [0, 1, 1, 0]);
  const opacityEdu  = useTransform(scrollYProgress, [0.35, 0.45, 0.62, 0.68], [0, 1, 1, 0]);

  // Cinematic X slides
  const xLeft          = useTransform(scrollYProgress, [0.32, 0.4, 0.62, 0.68], isMobile ? [-20, 0, 0, -20] : [-80, 0, 0, -80]);
  const xRight         = useTransform(scrollYProgress, [0.35, 0.45, 0.62, 0.68], isMobile ? [20, 0, 0, 20] : [80, 0, 0, 80]);
  const xRightSection3 = useTransform(scrollYProgress, [0.72, 0.82, 1], isMobile ? [0, 0, 0] : [80, 0, 0]);

  const heroTextY     = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const heroBadgeY    = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
  const heroSubtitleY = useTransform(scrollYProgress, [0, 0.25], [40, 0]);
  const heroRotate    = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const scaleBase  = useTransform(scrollYProgress, [0.32, 0.38, 0.62, 0.68], isMobile ? [0.98, 1, 1, 0.98] : [0.9, 1, 1, 0.9]);
  const scaleCards = useSpring(scaleBase, { stiffness: 80, damping: 20 });

  // Breathing animation for the canvas zoom (referenced in ScrollyCanvas, kept here for reference)
  const canvasScaleY = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <>
      {/* ── Noise Texture Overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-[5] opacity-[0.035] hidden md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

    <div ref={containerRef} className="pointer-events-none absolute left-0 top-0 z-10 w-full h-full">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — Hero
        ══════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: opacity1, y: y1, filter: blur1 }}
          className="sticky top-0 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 sm:px-6"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-transparent to-transparent pointer-events-none" />

          <motion.div
            style={{ rotate: heroRotate }}
            className="relative text-center"
          >
            {/* Badge */}
            <motion.div
              style={{ y: heroBadgeY }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="text-xs font-medium tracking-widest text-blue-200/80 uppercase">Available for projects</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              style={{ y: heroTextY }}
              initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-[14vw] xs:text-6xl sm:text-7xl font-black tracking-tighter text-white md:text-9xl lg:text-[12rem] leading-[0.85] select-none text-balance"
            >
              KRISH<br />BOHRA<span className="text-blue-500">.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              style={{ y: heroSubtitleY }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="mt-8 text-xl font-light tracking-[0.45em] text-white/35 sm:text-2xl uppercase"
            >
              Creative Web Developer
            </motion.p>
          </motion.div>

          {/* CTA buttons */}
          <div className="mt-16 flex flex-col items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              className="pointer-events-auto flex flex-col xs:flex-row items-center gap-4 w-full justify-center px-4"
            >
              <RippleButton 
                onClick={scrollToProjects}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-shadow duration-300"
              >
                View Projects <ArrowRight className="w-4 h-4" />
              </RippleButton>
              <RippleButton 
                onClick={scrollToContact}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md hover:border-white/30 hover:bg-white/10 transition-colors duration-300"
              >
                Contact Me <Mail className="w-4 h-4" />
              </RippleButton>
            </motion.div>

            {/* Now Playing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex items-center gap-4 border border-white/5 bg-black/25 px-6 py-3 backdrop-blur-xl rounded-2xl"
            >
              <div className="flex gap-1.5 items-end h-5">
                {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "100%", "20%"] }}
                    transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1.5 bg-blue-500/60 rounded-full"
                    style={{ height: `${h * 100}%` }}
                  />
                ))}
              </div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-white/50 flex items-center gap-2 uppercase">
                <Headphones className="w-3.5 h-3.5 text-blue-400" /> Currently crafting to Lofi Beats
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 — Bio & Education
        ══════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: opacity2, y: y2, filter: blur2, scale: scaleCards }}
          className="sticky top-0 flex flex-col lg:flex-row min-h-[100dvh] w-full items-center justify-center lg:justify-between px-4 sm:px-12 md:px-24 gap-3 lg:gap-8 py-20 lg:py-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* ── Left Bio Card ── */}
          <motion.div style={{ opacity: opacityBio, x: xLeft }} className="w-full lg:w-auto">
            <TiltCard className="pointer-events-auto group relative flex-1 w-full lg:max-w-md rounded-[2.5rem] p-5 lg:p-10 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              style={{ background: isMobile ? "rgba(10, 15, 30, 0.95)" : "rgba(14, 22, 50, 0.45)", backdropFilter: isMobile ? "none" : "blur(30px)" } as React.CSSProperties}
            >
              <div className="absolute -inset-x-20 -top-20 h-48 bg-blue-600/15 blur-[120px] opacity-60" />
              <div className="relative z-10">
                <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.35em] text-blue-400 mb-5 flex items-center gap-2">
                  <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-transparent" /> Background
                </p>
                <h2 className="text-sm lg:text-2xl font-black tracking-tight text-white/90 mb-1 uppercase">BSc-IT Graduate</h2>
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tighter text-white xl:text-5xl">
                  Elevating Digital<br />
                  <span className="text-white/25">Experiences.</span>
                </h3>
                <p className="mt-4 lg:mt-7 text-xs sm:text-sm lg:text-base leading-relaxed text-white/50 font-light hidden sm:block">
                  Specializing in <Keyword>WordPress</Keyword> ecosystems and full-stack architecture.
                  Bridging the gap between <Keyword>JavaScript</Keyword> and scalable <Keyword>.NET</Keyword> / <Keyword>PHP</Keyword> backends.
                </p>
                <div className="mt-4 lg:mt-10 flex flex-wrap gap-4">
                  <RippleButton 
                    onClick={scrollToProjects}
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 lg:px-6 lg:py-3 text-[11px] lg:text-sm font-bold text-black"
                  >
                    View Projects <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </RippleButton>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* ── Right Education Card ── */}
          <motion.div style={{ opacity: opacityEdu, x: xRight }} className="block w-full lg:w-auto">
            <TiltCard className="pointer-events-auto group relative flex-1 w-full lg:max-w-lg rounded-[2.5rem] p-5 lg:p-10 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] mt-2 lg:mt-0"
              style={{ background: isMobile ? "rgba(10, 15, 30, 0.95)" : "rgba(14, 22, 50, 0.35)", backdropFilter: isMobile ? "none" : "blur(20px)" } as React.CSSProperties}
            >
              <div className="relative z-10">
                <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.35em] text-blue-400 mb-5 flex items-center gap-2">
                  <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-transparent" /> Education
                </p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-tight xl:text-5xl">
                  SOMAIYA<br />UNIVERSITY
                </h2>
                <div className="mt-4 inline-block rounded-lg bg-blue-500/10 px-3 py-1.5 border border-blue-500/20">
                  <p className="text-blue-400 font-bold text-xs lg:text-lg tracking-widest">2024 — 2027</p>
                </div>
                <p className="mt-6 text-white/40 text-[10px] lg:text-sm font-medium tracking-wide leading-relaxed hidden sm:block">
                  Focusing on advanced computing, software engineering, and emerging web standards.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["HTML", "JavaScript", ".NET", "PHP", "React", "Next.js"].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-md text-[9px] lg:text-xs font-bold text-blue-300/80 border border-blue-500/20 bg-blue-500/5">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            SECTION 3 — Philosophy
        ══════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: opacity3, y: y3, filter: blur3 }}
          className="sticky top-0 flex min-h-[100dvh] w-full items-center justify-center lg:justify-end px-4 sm:px-[10vw]"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-transparent to-transparent pointer-events-none" />

          <motion.div style={{ x: xRightSection3 }} className="w-full lg:w-auto">
            <TiltCard className="pointer-events-auto group relative w-full lg:max-w-2xl rounded-[2.5rem] p-8 lg:p-12 border border-white/10 text-center lg:text-right shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden"
              style={{ background: isMobile ? "rgba(10, 15, 30, 0.95)" : "rgba(20, 14, 40, 0.45)", backdropFilter: isMobile ? "none" : "blur(30px)" } as React.CSSProperties}
            >
              <div className="relative z-10">
                <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.35em] text-purple-400 mb-5 flex items-center justify-center lg:justify-end gap-2">
                  Philosophy <span className="h-px w-8 bg-gradient-to-l from-purple-500 to-transparent" />
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tighter text-white sm:text-6xl text-balance">
                  Clean Code.<br />
                  <span className="text-white/25">Meaningful UX.</span>
                </h2>
                <p className="mt-8 text-sm lg:text-lg leading-relaxed text-white/45 font-light text-balance">
                  I build digital solutions that prioritize performance without sacrificing aesthetics. Eager to contribute to forward-thinking teams with a passion for polished, user-centric design.
                </p>
                <div className="mt-10 flex flex-wrap justify-center lg:justify-end gap-4">
                  <RippleButton 
                    onClick={scrollToContact}
                    className="rounded-full bg-purple-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-purple-900/40"
                  >
                    Let&apos;s Talk <Mail className="w-4 h-4" />
                  </RippleButton>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>

      </div>
    </>
  );
}
