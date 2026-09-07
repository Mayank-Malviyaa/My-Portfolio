import React, { useEffect, useRef } from 'react';

/**
 * BackgroundCanvas renders the smooth scroll-driven 240-frame gym atmosphere.
 * Operates behind all sections with a dark gradient overlay for optimal readability.
 */
export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const TOTAL_FRAMES = 240;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const getFramePath = (index) => {
      const padded = String(index).padStart(6, '0');
      return `frames/frame_${padded}.jpg`;
    };

    const images = [];
    let dpr = window.devicePixelRatio || 1;
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    let targetFrame = 0;
    let currentSmoothFrame = 0;
    const LERP_SPEED = 0.08;
    let lastRenderedFrame = -1;
    let animId;

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;

      canvas.width = Math.round(canvasWidth * dpr);
      canvas.height = Math.round(canvasHeight * dpr);

      renderFrame(Math.round(currentSmoothFrame));
    }

    function renderFrame(index) {
      const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
      const img = images[clampedIndex];

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      const scale = Math.max((canvasWidth * dpr) / imgW, (canvasHeight * dpr) / imgH);
      const renderW = imgW * scale;
      const renderH = imgH * scale;
      const renderX = (canvasWidth * dpr - renderW) / 2;

      // On mobile portrait, position slightly toward the top so the subject's face is clearly framed in the upper portion
      const isMobile = canvasWidth < 768 || canvasWidth / canvasHeight < 0.85;
      const renderY = isMobile
        ? Math.min(0, (canvasHeight * dpr - renderH) * 0.15)
        : (canvasHeight * dpr - renderH) / 2;

      ctx.drawImage(img, renderX, renderY, renderW, renderH);
    }

    // Preload frames in background
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (i === 1) renderFrame(0);
      };
      images.push(img);
    }

    function updateScrollTarget() {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;
      const maxScroll = (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight;

      if (maxScroll <= 0) return;
      const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      targetFrame = scrollFraction * (TOTAL_FRAMES - 1);
    }

    function loop() {
      currentSmoothFrame += (targetFrame - currentSmoothFrame) * LERP_SPEED;
      if (Math.abs(targetFrame - currentSmoothFrame) < 0.005) {
        currentSmoothFrame = targetFrame;
      }

      const rounded = Math.round(currentSmoothFrame);
      if (rounded !== lastRenderedFrame) {
        renderFrame(rounded);
        lastRenderedFrame = rounded;
      }
      animId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', updateScrollTarget, { passive: true });

    resizeCanvas();
    updateScrollTarget();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateScrollTarget);
    };
  }, []);

  return (
    <div className="bg-canvas-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="bg-canvas-scrim" />
    </div>
  );
}
