import React, { useState, useEffect, useRef } from 'react';

const photos = [
  'https://i.ibb.co/Ld2SBtvH/Whats-App-Image-2026-09-14-at-7-00-45-PM-1.jpg',
  'https://i.ibb.co/202JX8bD/Whats-App-Image-2026-09-14-at-7-00-45-PM-2.jpg',
  'https://i.ibb.co/pB3cYZDB/Whats-App-Image-2026-09-14-at-7-00-45-PM.jpg',
  'https://i.ibb.co/qFhJxn80/Whats-App-Image-2026-09-14-at-7-00-46-PM-1.jpg',
  'https://i.ibb.co/pjgrFD31/Whats-App-Image-2026-09-14-at-7-00-46-PM-2.jpg',
  'https://i.ibb.co/1f7xyCZD/Whats-App-Image-2026-09-14-at-7-00-46-PM.jpg',
  'https://i.ibb.co/sp8z5VdX/Whats-App-Image-2026-09-14-at-7-00-47-PM-1.jpg',
  'https://i.ibb.co/NgppGc6q/0a2b27a3-50c8-4c58-9a68-8264a9b9dcb8.jpg',
  'https://i.ibb.co/6c3RFT5G/Whats-App-Image-2026-09-14-at-7-00-48-PM-1.jpg',
  'https://i.ibb.co/ycW6DmH7/Whats-App-Image-2026-09-14-at-7-00-48-PM-2.jpg',
  'https://i.ibb.co/N806JVk/Whats-App-Image-2026-09-14-at-7-00-48-PM.jpg',
  'https://i.ibb.co/Z6bCbXJw/Whats-App-Image-2026-09-14-at-7-00-49-PM-1.jpg',
  'https://i.ibb.co/Y4cNX4wD/Whats-App-Image-2026-09-14-at-7-00-49-PM-2.jpg',
  'https://i.ibb.co/KcbVCVT8/Whats-App-Image-2026-09-14-at-7-00-49-PM-3.jpg',
  'https://i.ibb.co/bM3RfsGJ/Whats-App-Image-2026-09-14-at-7-00-49-PM.jpg',
  'https://i.ibb.co/SXYktkWX/Whats-App-Image-2026-09-14-at-7-00-50-PM.jpg',
  'https://i.ibb.co/dCdqP2X/Whats-App-Image-2026-09-14-at-7-00-50-PM.jpg',
];

export default function BirthdayCarousel() {
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 420, isMobile: false });
  
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(isHovered);

  // Keep physics configuration in a ref so the animation loop can access fresh values without re-rendering
  const configRef = useRef({
    isMobile: false,
    PITCH: 320,
    TOTAL_WIDTH: 320 * photos.length,
  });

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Handle Responsive Adjustments
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      // Calculate responsive width and 9:16 aspect ratio height
      const width = isMobile ? window.innerWidth * 0.35 : 240;
      const height = width * (16 / 9);
      const gap = isMobile ? 12 : 20;
      const pitch = width + gap;

      setDimensions({ width, height, isMobile });
      
      configRef.current = {
        isMobile,
        PITCH: pitch,
        TOTAL_WIDTH: pitch * photos.length,
      };
    };

    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      const speed = isHoveredRef.current ? 0.02 : 0.08;
      scrollPositionRef.current += deltaTime * speed;

      const { isMobile, PITCH, TOTAL_WIDTH } = configRef.current;

      if (containerRef.current) {
        const children = containerRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          
          const xPos = i * PITCH - scrollPositionRef.current;
          const wrappedX = ((xPos % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH;
          const adjustedX = wrappedX > TOTAL_WIDTH / 2 ? wrappedX - TOTAL_WIDTH : wrappedX;
          const absX = Math.abs(adjustedX);

          // Mobile screens need steeper math multipliers to achieve the same visual curve 
          // because the absolute pixel distances (adjustedX) are smaller.
          const zMultiplier = isMobile ? 1.1 : 0.45;
          const rotMultiplier = isMobile ? -0.12 : -0.045;

          const translateZ = absX * zMultiplier;
          const rotateY = adjustedX * rotMultiplier;
          const zIndex = Math.round(absX);
          
          let opacity = 1;
          if (isMobile) {
            // STRICT 3-IMAGE LIMIT FOR PHONE: 
            // Start fading right after the first item on either side, fully invisible by the second
            const fadeStart = PITCH * 0.85; 
            const fadeEnd = PITCH * 1.25;
            opacity = 1 - Math.max(0, (absX - fadeStart) / (fadeEnd - fadeStart));
            opacity = Math.max(0, Math.min(1, opacity));
          } else {
            // Smooth edge fade for desktop
            const edgeDist = (TOTAL_WIDTH / 2) - absX;
            opacity = Math.max(0, Math.min(1, edgeDist / 150));
          }

          child.style.transform = `translate(-50%, -50%) translateX(${adjustedX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
          child.style.zIndex = zIndex.toString();
          child.style.opacity = opacity.toString();
        }
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

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
          Wishing you more love, laughter and happiness this year
        </p>
      </div>

      <div
        className={`relative w-full overflow-hidden transition-all duration-300 ${dimensions.isMobile ? 'h-[420px]' : 'h-[620px]'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="w-full h-full absolute inset-0" 
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
                  className="absolute top-1/2 left-1/2 flex-shrink-0 group cursor-pointer will-change-transform rounded-2xl sm:rounded-[32px] overflow-hidden bg-neutral-900 shadow-xl"
                  style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    opacity: 0, 
                  }}
                >
                  <img
                    src={photo}
                    alt={`Memory ${index}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}