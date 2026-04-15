"use client";

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { useRef, useCallback, useState } from "react";

const projects = [
  {
    id: 1,
    title: "NuroBilling",
    description: "High-performance billing software designed for small businesses. Generate invoices in seconds, track real-time revenue, and boost efficiency.",
    tags: ["SaaS", "Dashboard", "Invoicing", "React"],
    accent: "rgba(59,130,246,",
    glow: "from-blue-500/20 to-orange-500/20",
    number: "01",
    link: "https://www.google.com",
    videoUrl: "/videos/nurobilling.mp4",
    imageUrl: "/images/nurobilling.png",
  },
];

// ─── 3D Tilt Project Card ─────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: (typeof projects)[0] & { videoUrl?: string; imageUrl?: string };
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  });

  const spotX  = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotY  = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const spotBg = useMotionTemplate`radial-gradient(circle at ${spotX} ${spotY}, ${project.accent}0.08) 0%, transparent 65%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || (typeof window !== 'undefined' && window.innerWidth < 768)) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Ripple state
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id   = Date.now();
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
        <motion.div
          ref={ref}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/8
                     bg-[rgba(14,22,50,0.4)] backdrop-blur-[12px]
                     shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.4)]
                     transition-shadow duration-500
                     hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_30px_80px_rgba(0,0,0,0.5)]"
        >
          {/* Mouse-tracked light spot */}
          <motion.div
            style={{ background: spotBg }}
            className="absolute inset-0 rounded-3xl pointer-events-none z-10"
          />

          {/* Shimmer sweep on hover */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none z-10
                       transition-opacity duration-500 overflow-hidden"
          >
            <div className="shimmer-border absolute inset-0 rounded-3xl" />
          </div>

          {/* Project Image Background */}
          {project.imageUrl && (
            <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
              <motion.img
                src={project.imageUrl}
                alt={project.title}
                initial={{ scale: 1, opacity: 0.5 }}
                whileHover={{ scale: 1.1, opacity: 0.85 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
            </div>
          )}

          {/* Gradient glow bg */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.glow}
                        opacity-0 transition-opacity duration-700 blur-2xl
                        group-hover:opacity-100 mix-blend-screen pointer-events-none z-10`}
          />

          <div className="relative z-20 flex flex-col justify-between min-h-[360px] p-8 sm:p-10">
            {/* Header row */}
            <div className="flex justify-between items-start">
              {/* Project number */}
              <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">
                {project.number}
              </span>

              {/* Arrow button with ripple */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addRipple(e);
                  onClick();
                }}
                className="relative w-11 h-11 rounded-full border border-white/15
                           flex items-center justify-center
                           bg-white/5 overflow-hidden
                           group-hover:border-white/30 group-hover:bg-white/10
                           transition-all duration-400 -rotate-45 group-hover:rotate-0"
              >
                {ripples.map((r) => (
                  <span
                    key={r.id}
                    className="absolute rounded-full bg-white/20 animate-ripple pointer-events-none"
                    style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
                  />
                ))}
                <ArrowUpRight className="w-4 h-4 text-white/70" />
              </motion.button>
            </div>

            {/* Title & description */}
            <div className="mt-8">
              <motion.h3 
                layoutId={`title-${project.id}`}
                className="text-3xl font-bold tracking-tight text-white
                               transition-all duration-500 group-hover:tracking-tighter sm:text-4xl"
              >
                {project.title}
              </motion.h3>
              <p className="mt-3 text-base text-white/45 leading-relaxed font-light max-w-md
                            transition-colors duration-500 group-hover:text-white/65">
                {project.description}
              </p>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="rounded-full border border-white/10 bg-white/[0.04]
                               px-4 py-1.5 text-xs font-semibold text-white/50 backdrop-blur-sm
                               transition-all duration-400
                               group-hover:border-white/20 group-hover:text-white/80
                               group-hover:bg-white/[0.07]"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              {/* View Project Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="relative z-50 px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm
                           flex items-center gap-2 transition-all duration-300
                           hover:bg-white/90 shadow-xl shadow-white/10"
              >
                View Case Study
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────
export default function Projects() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section id="projects" className="relative z-20 bg-[#121212] px-6 py-32 sm:px-12 md:px-24">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Background ambient glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px]
                      bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-20 gap-8"
        >
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400 mb-3 flex items-center gap-2"
            >
              <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-transparent" />
              Selected Works
            </motion.p>
            <h2 className="text-5xl font-black tracking-tighter text-white sm:text-7xl">
              Projects<span className="text-blue-500">.</span>
            </h2>
            <p className="mt-4 text-lg text-white/40 max-w-lg font-light">
              Digital experiences that blend{" "}
              <span className="text-white/70 font-medium">design</span> with{" "}
              <span className="text-white/70 font-medium">high-performance engineering</span>.
            </p>
          </div>
        </motion.div>

        {/* Project grid */}
        <div className="flex justify-center flex-col items-center">
          <div className="w-full max-w-4xl">
          {projects.map((project, i) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={i} 
              onClick={() => {
                if ('videoUrl' in project && project.videoUrl) {
                  setSelectedVideo(project.videoUrl);
                }
              }}
            />
          ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl aspect-video bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
              <video
                src={selectedVideo}
                autoPlay
                muted
                playsInline
                controls
                className="w-full h-full object-contain bg-black shadow-inner"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
