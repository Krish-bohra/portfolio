"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const frameCount = 120;

  // ─── Scroll → Frame index ──────────────────────────────
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // ─── Scroll-linked zoom (1→1.12 over full scroll) ─────
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const scale = useSpring(scaleRaw, { stiffness: 60, damping: 20 });

  // ─── Gradient overlay opacity shifts by scroll ─────────
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.18, 0.35, 0.25, 0.4]);

  // ─── 1. Preload all frames ─────────────────────────────
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/sequence/ezgif-frame-${paddedIndex}.png`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx && loadedImages[0]) {
              drawImageCover(ctx, loadedImages[0], canvasRef.current);
            }
          }
        }
      };
      loadedImages.push(img);
    }
  }, []);

  // ─── 2. Render frame on scroll ────────────────────────
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (images.length === frameCount && canvasRef.current) {
      const currentFrame = Math.round(latest);
      const ctx = canvasRef.current.getContext("2d");
      if (ctx && images[currentFrame]) {
        drawImageCover(ctx, images[currentFrame], canvasRef.current);
      }
    }
  });

  // ─── 3. Handle resize ─────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width  = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const currentFrame = Math.round(frameIndex.get());
        if (images.length === frameCount && images[currentFrame]) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) drawImageCover(ctx, images[currentFrame], canvasRef.current);
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

        {/* Canvas with scroll-linked zoom + breathing pulse */}
        <motion.canvas
          ref={canvasRef}
          style={{ scale }}
          className="h-full w-full object-cover animate-breathe"
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
