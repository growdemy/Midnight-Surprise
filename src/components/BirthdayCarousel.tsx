import React, { useState, useEffect, useRef } from 'react';

const photos = [
  'https://i.ibb.co/BHZrYNzN/Whats-App-Image-2026-09-14-at-5-11-15-PM.jpg',
  'https://i.ibb.co/hxnP1z8r/Whats-App-Image-2026-09-14-at-5-11-15-PM-1.jpg',
  'https://i.ibb.co/PskxPWbN/Whats-App-Image-2026-09-14-at-5-07-55-PM.jpg',
  'https://i.ibb.co/RGLDSjV3/Whats-App-Image-2026-09-14-at-5-07-55-PM-1.jpg',
  'https://i.ibb.co/sJwFbP49/Whats-App-Image-2026-09-14-at-5-07-54-PM.jpg',
  'https://i.ibb.co/KpPR7x8d/Whats-App-Image-2026-09-14-at-5-07-54-PM-1.jpg',
  'https://i.ibb.co/dCdqP2X/Whats-App-Image-2026-09-14-at-7-00-50-PM.jpg',
];

export default function BirthdayCarousel() {
  const [dimensions, setDimensions] = useState({ width: 300, height: 420, isMobile: false });
  
  const scrollPositionRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  const configRef = useRef({
    isMobile: false,
    PITCH: 320,
    TOTAL_WIDTH: 320 * photos.length,
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? window.innerWidth * 0.45 : 240;
      const height = width * (16 / 9);
      const gap = isMobile ? 16 : 24;
      const pitch = width + gap;

      setDimensions({ width, height, isMobile });
      
      configRef.current = {
        isMobile,
        PITCH: pitch,
        TOTAL_WIDTH: pitch * photos.length,
      };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update positions without auto increment
  const updatePositions = () => {
    const { isMobile, PITCH, TOTAL_WIDTH } = configRef.current;
    if (containerRef.current) {
      const children = containerRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const xPos = i * PITCH - scrollPositionRef.current;
        const wrappedX = ((xPos % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH;
        const adjustedX = wrappedX > TOTAL_WIDTH / 2 ? wrappedX - TOTAL_WIDTH : wrappedX;
        const absX = Math.abs(adjustedX);

        const zMultiplier = isMobile ? 1.1 : 0.45;
        const rotMultiplier = isMobile ? -0.12 : -0.045;

        const translateZ = absX * zMultiplier;
        const rotateY = adjustedX * rotMultiplier;
        const zIndex = Math.round(absX);
        
        let opacity = 1;
        if (isMobile) {
          const fadeStart = PITCH * 0.85; 
          const fadeEnd = PITCH * 1.25;
          opacity = 1 - Math.max(0, (absX - fadeStart) / (fadeEnd - fadeStart));
          opacity = Math.max(0, Math.min(1, opacity));
        } else {
          const edgeDist = (TOTAL_WIDTH / 2) - absX;
          opacity = Math.max(0, Math.min(1, edgeDist / 150));
        }

        child.style.transform = `translate(-50%, -50%) translateX(${adjustedX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
        child.style.zIndex = zIndex.toString();
        child.style.opacity = opacity.toString();
      }
    }
  };

  useEffect(() => {
    updatePositions();
  }, [dimensions]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = scrollPositionRef.current;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    scrollPositionRef.current = startScrollRef.current - deltaX * 1.2;
    updatePositions();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    scrollPositionRef.current += e.deltaY * 0.8 || e.deltaX * 0.8;
    updatePositions();
  };

  return (
    <section className="w-full min-h-screen bg-white text-neutral-900 py-24 flex flex-col justify-center relative font-sans overflow-hidden">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full px-6 mb-12 sm:mb-16 text-center relative z-10">
        <h1 
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-4 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'normal' }}
        >
          Happiest Birthday<br />
          <span style={{ color: '#7f0000', fontStyle: 'italic' }}>Mera Dudu, Meri Choti si Biwi</span>
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal">
          Drag horizontally or scroll to browse our memories
        </p>
      </div>

      <div
        className={`relative w-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y ${dimensions.isMobile ? 'h-[420px]' : 'h-[620px]'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div 
          className="w-full h-full absolute inset-0 pointer-events-none" 
          style={{ perspective: dimensions.isMobile ? '800px' : '1200px' }}
        >
          <div
            ref={containerRef}
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {photos.map((photo, index) => {
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 flex-shrink-0 group cursor-pointer will-change-transform rounded-2xl sm:rounded-[32px] overflow-hidden bg-neutral-900 shadow-xl pointer-events-auto"
                  style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    opacity: 0, 
                  }}
                >
                  <img
                    src={photo}
                    alt={`Memory ${index}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
