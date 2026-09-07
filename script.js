(() => {
  const TOTAL_FRAMES = 240;
  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const sideScrollThumb = document.getElementById('side-scroll-thumb');
  const pageProgressFill = document.getElementById('page-progress-fill');

  // Generate zero-padded frame filename
  const getFramePath = (index) => {
    const padded = String(index).padStart(6, '0');
    return `frames/frame_${padded}.jpg`;
  };

  const images = [];
  let loadedCount = 0;

  // Track target frame index and smooth interpolated frame index
  let targetFrame = 0;
  let currentSmoothFrame = 0;

  // LERP smoothing factor (lower = smoother inertia, higher = more direct tracking)
  const LERP_SPEED = 0.08;

  // Resize canvas to match window with devicePixelRatio for ultra-sharp rendering
  let dpr = window.devicePixelRatio || 1;
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    renderFrame(Math.round(currentSmoothFrame));
  }

  // Render a specific image frame onto canvas with cover aspect ratio
  function renderFrame(index) {
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    const img = images[clampedIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Use cover fit to fill screen properly
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max((canvasWidth * dpr) / imgW, (canvasHeight * dpr) / imgH);
    const renderW = imgW * scale;
    const renderH = imgH * scale;
    const renderX = (canvasWidth * dpr - renderW) / 2;
    const renderY = (canvasHeight * dpr - renderH) / 2;

    ctx.drawImage(img, renderX, renderY, renderW, renderH);
  }

  // Preload all frames
  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${percent}%`;

        // Draw first frame immediately as soon as it arrives
        if (i === 1) {
          renderFrame(0);
        }

        // When all frames are loaded, reveal UI smoothly
        if (loadedCount === TOTAL_FRAMES) {
          onAllFramesLoaded();
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          onAllFramesLoaded();
        }
      };

      images.push(img);
    }
  }

  function onAllFramesLoaded() {
    setTimeout(() => {
      if (loader) loader.classList.add('loaded');
      resizeCanvas();
    }, 200);
  }

  // Calculate scroll position as normalized progress [0, 1]
  function updateScrollTarget() {
    const doc = document.documentElement;
    const scrollTop = window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;
    const maxScroll = (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    
    if (maxScroll <= 0) return;

    const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    targetFrame = scrollFraction * (TOTAL_FRAMES - 1);

    // Update side scrollbar thumb position
    if (sideScrollThumb) {
      const maxThumbTravel = 90 - 28; // track height - thumb height
      sideScrollThumb.style.transform = `translateY(${scrollFraction * maxThumbTravel}px)`;
    }

    // Update bottom page progress line fill
    if (pageProgressFill) {
      const minFill = 20; // base width percentage
      const progressPercent = minFill + (scrollFraction * (100 - minFill));
      pageProgressFill.style.width = `${progressPercent}%`;
    }
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateScrollTarget();
  });

  // Animation Loop with LERP interpolation
  let lastRenderedFrame = -1;

  function animationLoop() {
    // Lerp smoothly toward target
    currentSmoothFrame += (targetFrame - currentSmoothFrame) * LERP_SPEED;

    // Snap if very close
    if (Math.abs(targetFrame - currentSmoothFrame) < 0.005) {
      currentSmoothFrame = targetFrame;
    }

    const roundedFrame = Math.round(currentSmoothFrame);
    if (roundedFrame !== lastRenderedFrame) {
      renderFrame(roundedFrame);
      lastRenderedFrame = roundedFrame;
    }

    requestAnimationFrame(animationLoop);
  }

  // Initialize
  resizeCanvas();
  preloadFrames();
  updateScrollTarget();
  requestAnimationFrame(animationLoop);
})();
