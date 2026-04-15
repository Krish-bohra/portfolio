"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const frameCount = 120;

  // ─── Scroll → Frame index ──────────────────────────────
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // ─── Scroll-linked zoom (1→1.12 over full scroll) ─────
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const scale = useSpring(scaleRaw, { stiffness: 60, damping: 20 });

  // ─── Gradient overlay opacity shifts by scroll ─────────
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.18, 0.35, 0.25, 0.4]);

  // ─── 1. Load First Frame Fast + Preload Rest ───────────
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    
    // Function to load a single image
    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const paddedIndex = String(index).padStart(3, "0");
        img.src = `/sequence/ezgif-frame-${paddedIndex}.png`;
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Fallback to previous image if one fails to load
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
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) drawImageCover(ctx, firstImg, canvasRef.current);
      }

      // 2. Preload the remaining frames in the background
      const preloadRemaining = async () => {
        const promises = [];
        // On mobile, only load every 2nd frame to save 50% memory
        const step = isMobile ? 2 : 1;
        
        for (let i = 1; i <= frameCount; i += step) {
          promises.push(loadImage(i));
        }
        
        try {
          const loaded = await Promise.all(promises);
          if (isMounted) {
            setImages(loaded);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Failed to preload sequence", err);
        }
      };
      
      preloadRemaining();
    });

    return () => { isMounted = false; };
  }, []);

  // ─── 2. Render frame on scroll ────────────────────────
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (images.length > 0 && canvasRef.current) {
      const isMobile = window.innerWidth < 768;
      // On mobile, images.length is 60, total frames is 120.
      // So we map latest (0-119) to (0-59)
      const mappedIndex = isMobile 
        ? Math.min(Math.floor(latest / 2), images.length - 1)
        : Math.min(Math.floor(latest), images.length - 1);

      const ctx = canvasRef.current.getContext("2d");
      if (ctx && images[mappedIndex]) {
        drawImageCover(ctx, images[mappedIndex], canvasRef.current);
      }
    }
  });

  // ─── 3. Handle resize ─────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Set display size
        canvasRef.current.width  = window.innerWidth * (window.devicePixelRatio || 1);
        canvasRef.current.height = window.innerHeight * (window.devicePixelRatio || 1);
        
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  };

  return (
    <div className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#121212]">
        
        {/* Loading Overlay */}
        {isLoading && !isFirstFrameLoaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#121212]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <p className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase">Loading Experience</p>
            </div>
          </div>
        )}

        {/* Canvas with scroll-linked zoom */}
        <motion.canvas
          ref={canvasRef}
          style={{ 
            scale,
            filter: "contrast(1.05) brightness(0.95)"
          }}
          className="h-full w-full pointer-events-none"
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
