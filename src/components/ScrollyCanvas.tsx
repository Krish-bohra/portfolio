"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import NextImage from "next/image";

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const frameCount = 120;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ─── Scroll → Frame index (with spring for buttery smoothness) ──
  const frameIndexRaw = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);
  const frameIndex = useSpring(frameIndexRaw, { stiffness: 400, damping: 40, mass: 0.1 });

  // ─── Scroll-linked zoom (1→1.12 over full scroll) ─────
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const scale = useSpring(scaleRaw, { stiffness: 60, damping: 20 });

  // ─── Gradient overlay opacity shifts by scroll ─────────
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.18, 0.35, 0.25, 0.4]);

  // ─── 1. Load First Frame Fast + Preload Rest ───────────
  useEffect(() => {
    let isMounted = true;
    
    // Function to load and decode a single image
    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        const paddedIndex = String(index).padStart(3, "0");
        img.src = `/sequence/ezgif-frame-${paddedIndex}.png`;
        img.onload = async () => {
          try {
            if ('decode' in img) await img.decode();
            resolve(img);
          } catch {
            resolve(img);
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load frame ${index}`);
          resolve(new Image()); 
        };
      });
    };

    const isMobile = window.innerWidth < 768;

    // 1. Load the first frame immediately
    loadImage(1).then((firstImg) => {
      if (!isMounted) return;
      setIsFirstFrameLoaded(true);
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d", { alpha: false });
        if (ctx) drawImageCover(ctx, firstImg, canvasRef.current);
      }

      // 2. Preload the remaining frames in the background
      const preloadRemaining = async () => {
        const promises = [];
        const step = isMobile ? 2 : 1;
        
        for (let i = 1; i <= frameCount; i += step) {
          promises.push(loadImage(i));
        }
        
        const loaded = await Promise.all(promises);
        if (isMounted) {
          setImages(loaded);
          setIsLoading(false);
          // Initial refresh once all images are decoded
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d", { alpha: false });
            if (ctx && loaded[0]) drawImageCover(ctx, loaded[0], canvasRef.current);
          }
        }
      };
      
      preloadRemaining();
    });

    return () => { isMounted = false; };
  }, []);

  // ─── 2. Render frame on scroll ────────────────────────
  const lastDrawnFrame = useRef<number>(-1);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (images.length > 0 && canvasRef.current) {
      const isMobile = window.innerWidth < 768;
      
      const mappedIndex = isMobile 
        ? Math.min(Math.floor(latest / 2), images.length - 1)
        : Math.min(Math.floor(latest), images.length - 1);

      if (mappedIndex === lastDrawnFrame.current) return;
      lastDrawnFrame.current = mappedIndex;

      const ctx = canvasRef.current.getContext("2d", { alpha: false });
      if (ctx && images[mappedIndex]) {
        // Draw immediately for direct feedback, but ensure no backlogs
        drawImageCover(ctx, images[mappedIndex], canvasRef.current);
      }
    }
  });

  // ─── 3. Handle resize ─────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const isMobileScreen = window.innerWidth < 768;
        // Set display size - Cap pixel ratio on mobile to 1.1 for performance
        const dpr = Math.min(window.devicePixelRatio || 1, isMobileScreen ? 1.1 : 2.5);
        canvasRef.current.width  = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        
        const currentFrame = Math.round(frameIndex.get());
        const imgToDraw = images[currentFrame] || images[0];
        
        if (imgToDraw) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) drawImageCover(ctx, imgToDraw, canvasRef.current);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [images, frameIndex]);

  // ─── object-fit: cover helper ─────────────────────────
  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement
  ) => {
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio    = img.width / img.height;
    let renderWidth, renderHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderWidth  = canvas.width;
      renderHeight = canvas.width / imgRatio;
      offsetX      = 0;
      offsetY      = (canvas.height - renderHeight) / 2;
    } else {
      renderWidth  = canvas.height * imgRatio;
      renderHeight = canvas.height;
      offsetX      = (canvas.width - renderWidth) / 2;
      offsetY      = 0;
    }

    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Removed for performance as image covers full area
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#121212]">
        
        {/* Loading Overlay (fades out instead of unmounting) */}
        <div 
          className={`absolute inset-0 z-40 flex items-center justify-center bg-[#121212]/30 backdrop-blur-md pointer-events-none transition-all duration-1000 ${
            isLoading && !isFirstFrameLoaded ? "opacity-100" : "opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-blue-400 uppercase drop-shadow-lg">Loading Experience</p>
          </div>
        </div>

        {/* LCP Optimization: Server-rendered static first frame */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{ 
            opacity: isFirstFrameLoaded ? 0 : 1, 
            transition: "opacity 1s ease",
            scale,
            filter: isMobile ? "none" : "contrast(1.05) brightness(0.95)",
            transformOrigin: "center center"
          }}
        >
          <NextImage 
            src="/sequence/ezgif-frame-001.png" 
            alt="Cinematic background" 
            fill 
            className="object-cover" 
            priority
            quality={60}
            unoptimized
          />
        </motion.div>

        {/* Canvas with scroll-linked zoom */}
        <motion.canvas
          ref={canvasRef}
          style={{ 
            scale,
            filter: isMobile ? "none" : "contrast(1.05) brightness(0.95)",
            transformOrigin: "center center"
          }}
          className="absolute inset-0 h-full w-full pointer-events-none z-20"
        />

        {/* Animated gradient color shift overlay (light flicker) */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(ellipse at 30% 40%, rgba(37,99,235,0.18) 0%, transparent 60%)",
              "radial-gradient(ellipse at 70% 60%, rgba(99,60,220,0.15) 0%, transparent 60%)",
              "radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse at 30% 40%, rgba(37,99,235,0.18) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Subtle vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Bottom fade-to-bg so the Projects section blends in */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none bg-gradient-to-t from-[#121212] to-transparent" />
      </div>
    </div>
  );
}
