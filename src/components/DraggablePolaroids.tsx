import React from 'react';
import { motion } from 'motion/react';

interface PolaroidItem {
  id: number;
  url: string;
  caption: string;
  initialX: number;
  initialY: number;
  rotate: number;
}

const polaroids: PolaroidItem[] = [
  {
    id: 1,
    url: 'https://i.ibb.co/Rp1RYwtT/Chat-GPT-Image-Sep-14-2026-07-54-50-PM.webp',
    caption: 'Mera Baccha 🐥',
    initialX: -140,
    initialY: -100,
    rotate: -6,
  },
  {
    id: 2,
    url: 'https://i.ibb.co/23JVs0sJ/Chat-GPT-Image-Sep-14-2026-07-58-31-PM.webp',
    caption: 'Meri Biwi 💋',
    initialX: 120,
    initialY: -110,
    rotate: 5,
  },
  {
    id: 3,
    url: 'https://i.ibb.co/QWDJ54m/Chat-GPT-Image-Sep-14-2026-08-03-59-PM.webp',
    caption: 'Meri Jaan 🫀',
    initialX: -100,
    initialY: 120,
    rotate: 8,
  },
  {
    id: 4,
    url: 'https://i.ibb.co/r27Q1t0m/Chat-GPT-Image-Sep-14-2026-08-06-38-PM.webp',
    caption: 'Mera Mota 🐼',
    initialX: 140,
    initialY: 100,
    rotate: -4,
  },
  {
    id: 5,
    url: 'https://i.ibb.co/Wp2qwxMP/Chat-GPT-Image-Sep-14-2026-08-08-45-PM.webp',
    caption: 'Mera Cutie Patutie 🤭',
    initialX: -10,
    initialY: -20,
    rotate: 2,
  },
  {
    id: 6,
    url: 'https://i.ibb.co/PsCVynHX/Chat-GPT-Image-Sep-14-2026-08-14-53-PM.webp',
    caption: 'Meri Dhanno 🙈',
    initialX: -220,
    initialY: 10,
    rotate: -8,
  },
  {
    id: 7,
    url: 'https://i.ibb.co/whH7t1kx/Chat-GPT-Image-Sep-14-2026-08-21-15-PM.webp',
    caption: 'Mera Dudu 🤍',
    initialX: 60,
    initialY: 140,
    rotate: 6,
  },
];

export default function DraggablePolaroids() {
  return (
    <section className="min-h-screen w-full bg-[#550000] relative overflow-hidden flex items-center justify-center p-0 m-0 border-t border-neutral-900 select-none">
      {/* Subtle Grid Paper Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Full Section Container for Draggable Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
        
        {/* Decorative Background Stickers */}
        <div className="absolute top-12 left-16 text-neutral-300 text-3xl select-none pointer-events-none">✨</div>
        <div className="absolute bottom-16 right-20 text-neutral-300 text-4xl select-none pointer-events-none">🦋</div>
        <div className="absolute top-1/4 right-24 text-neutral-300 text-2xl select-none pointer-events-none">💖</div>

        {polaroids.map((item) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={{ left: -500, right: 500, top: -400, bottom: 400 }}
            dragElastic={0.1}
            dragMomentum={true}
            whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
            whileTap={{ scale: 1.06, zIndex: 100, transition: { duration: 0.1 } }}
            whileDrag={{ scale: 1.08, zIndex: 100, cursor: 'grabbing', transition: { duration: 0.1 } }}
            initial={{ x: item.initialX, y: item.initialY, rotate: item.rotate }}
            className="absolute cursor-grab active:cursor-grabbing group select-none z-20"
            style={{ touchAction: 'none' }}
          >
            {/* Polaroid Frame */}
            <div className="bg-white p-2.5 pb-7 sm:p-3.5 sm:pb-10 rounded-lg shadow-2xl border border-neutral-200/80 w-[150px] sm:w-[240px] relative transition-shadow group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
              
              {/* Red Heart Attached on Top-Right Corner */}
              <div className="absolute -top-3 -right-3 text-xl sm:text-3xl flex items-center justify-center z-30 pointer-events-none filter drop-shadow-[0_4px_8px_rgba(220,38,38,0.5)] select-none">
                ❤️
              </div>

              {/* Photo */}
              <div className="w-full h-[160px] sm:h-[250px] overflow-hidden rounded bg-neutral-100 pointer-events-none">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Caption */}
              <div className="absolute bottom-1.5 sm:bottom-2.5 left-0 right-0 text-center px-1 pointer-events-none">
                <span 
                  className="text-neutral-800 font-medium text-xs sm:text-lg tracking-wide truncate block"
                  style={{ fontFamily: "'Caveat', cursive, serif" }}
                >
                  {item.caption}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
