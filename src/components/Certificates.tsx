"use client";

import { useRef, useState } from "react";
// @ts-ignore
import { gsap } from "gsap";
// @ts-ignore
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Award, Code, Shield, Cpu, Database, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const certificates = [
  {
    id: 1,
    title: "Using MySQL Database with PHP",
    issuer: "Coursera (Project Network)",
    year: "2026",
    icon: <Database className="w-8 h-8 text-blue-400" />,
    image: "/certificates/cert1.png",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 2,
    title: "Python Data Structures",
    issuer: "University of Michigan",
    year: "2026",
    icon: <Code className="w-8 h-8 text-emerald-400" />,
    image: "/certificates/cert2.png",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: 3,
    title: "Introduction to DevOps",
    issuer: "IBM",
    year: "2026",
    icon: <Shield className="w-8 h-8 text-rose-400" />,
    image: "/certificates/cert3.png",
    color: "from-rose-500/20 to-orange-500/20",
  },
  {
    id: 4,
    title: "Advanced Relational Database and SQL",
    issuer: "Coursera (Project Network)",
    year: "2026",
    icon: <Database className="w-8 h-8 text-amber-400" />,
    image: "/certificates/cert4.jpeg",
    color: "from-amber-500/20 to-yellow-500/20",
  },
];

export default function Certificates() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCert, setSelectedCert] = useState<typeof certificates[0] | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const isMobile = window.innerWidth < 768;

    // Set initial states for cards: only first is visible
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      if (index === 0) {
        gsap.set(card, { rotateY: 0, opacity: 1, zIndex: 50 });
      } else {
        // Less rotation on mobile to save memory/rendering
        gsap.set(card, { rotateY: isMobile ? 80 : 90, opacity: 0, zIndex: 50 - index });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: isMobile ? "+=1200" : "+=3000", // Shorter scroll on mobile for better feel
        scrub: isMobile ? 0.4 : 1.5, // Faster response on mobile
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    certificates.forEach((_, index) => {
      const currentCard = cardsRef.current[index];
      const nextCard = cardsRef.current[index + 1];

      // Hold time for each card
      tl.to({}, { duration: 0.3 });

      if (index < certificates.length - 1 && currentCard && nextCard) {
        tl.to(
          currentCard,
          {
            // On mobile: slide up and fade out instead of messy 3D rotation
            y: isMobile ? -50 : 0,
            rotateY: isMobile ? -15 : -90,
            scale: isMobile ? 0.9 : 1,
            opacity: 0,
            zIndex: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          `transition-${index}`
        );

        tl.to(
          nextCard,
          {
            y: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            zIndex: 50,
            duration: 1,
            ease: "power2.inOut",
          },
          `transition-${index}`
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef });


  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-[100dvh] w-full bg-[#0a0a0a] overflow-hidden"
      >
        {/* Subtle Grid / Parallax Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Title Section */}
        <div className="absolute top-12 left-0 right-0 z-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Certifications<span className="text-blue-500">.</span>
          </h2>
          <p className="mt-4 text-white/50 lowercase tracking-widest text-sm">Click to expand any certificate</p>
        </div>

        {/* 3D Perspective Container */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none [transform-style:preserve-3d]"
          style={{ perspective: "1500px" }}
        >
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="absolute flex w-[90vw] max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md pointer-events-auto md:h-[60vh] md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] [transform-style:preserve-3d]"
            >
              {/* Background Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-20`}
              />

              {/* Left side: Image / Visual */}
              <div 
                className="group relative h-64 w-full cursor-pointer overflow-hidden bg-white/5 md:h-full md:w-1/2"
                onClick={() => setSelectedCert(cert)}
              >
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4 transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 translate-z-10">
                    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black shadow-lg">
                      <Search className="w-4 h-4" /> View Full
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
              </div>

              {/* Right side: Details */}
              <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-12">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner backdrop-blur-md">
                  {cert.icon}
                </div>

                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70 uppercase tracking-widest backdrop-blur-sm">
                    {cert.year}
                  </span>
                </div>

                <h3 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {cert.title}
                </h3>

                <p className="mb-8 text-lg text-white/50">
                  Issued by <span className="text-white/80">{cert.issuer}</span>
                </p>

                {/* Decorative line */}
                <div className="mt-auto h-[1px] w-full bg-gradient-to-r from-white/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QuickView Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl cursor-default"
            >
              <div className="flex h-full flex-col md:flex-row">
                {/* Image Section */}
                <div className="flex-[2] bg-white/5 p-4 flex items-center justify-center">
                  <div className="relative h-full w-full min-h-[40vh]">
                    <Image
                      src={selectedCert.image}
                      alt={selectedCert.title}
                      fill
                      sizes="(max-width: 1200px) 100vw, 70vw"
                      className="object-contain shadow-2xl"
                    />
                  </div>
                </div>
                {/* Info Section */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-black/60 backdrop-blur-xl">
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                    {selectedCert.icon}
                  </div>
                  <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4">Official Certification</span>
                  <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{selectedCert.title}</h2>
                  <p className="text-xl text-white/60 mb-8">Verified recognition from <span className="text-white font-bold">{selectedCert.issuer}</span></p>
                  
                  <div className="flex items-center gap-6 mt-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Year Issued</p>
                      <p className="text-2xl font-bold text-white tracking-widest">{selectedCert.year}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Status</p>
                      <p className="text-emerald-400 font-bold flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Verified & Active</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedCert(null)}
                    className="mt-12 w-fit rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-white/90 hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

              {/* Close button (desktop) */}
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-6 right-6 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

