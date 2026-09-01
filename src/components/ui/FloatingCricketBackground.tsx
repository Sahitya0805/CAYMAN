'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const FloatingCricketBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  const smoothY = useSpring(scrollY, { stiffness: 45, damping: 25, restDelta: 0.001 });
  const yParallax1 = useTransform(smoothY, [0, 2500], [0, -140]);
  const yParallax2 = useTransform(smoothY, [0, 2500], [0, 100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Ambient Velvet Glows */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-blue-900/20 via-navy-900/10 to-transparent rounded-full blur-[140px] transform-gpu" />
      <div className="absolute top-1/2 left-0 w-[650px] h-[650px] bg-gradient-to-tr from-cskgold-500/10 via-navy-950/10 to-transparent rounded-full blur-[160px] transform-gpu" />

      {/* Layer 1: Floating Genuine Leather Cricket Ball (Top-Right) */}
      <motion.div style={{ y: yParallax1 }} className="absolute inset-0">
        <motion.div
          animate={{
            y: [-25, 28, -25],
            x: [15, -15, 15],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
          }}
          className="absolute top-28 right-[8%] w-40 h-40 opacity-[0.35] filter drop-shadow-[0_0_25px_rgba(229,184,66,0.3)] transform-gpu"
        >
          {/* Authentic 3D Leather Cricket Ball SVG */}
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
              <radialGradient id="cricketBallGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFA69E" />
                <stop offset="25%" stopColor="#D32F2F" />
                <stop offset="65%" stopColor="#80100C" />
                <stop offset="100%" stopColor="#250302" />
              </radialGradient>
              <linearGradient id="seamGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF0B8" />
                <stop offset="50%" stopColor="#E5B842" />
                <stop offset="100%" stopColor="#C99727" />
              </linearGradient>
            </defs>

            {/* Ball Sphere */}
            <circle cx="60" cy="60" r="54" fill="url(#cricketBallGrad)" />

            {/* Shine Reflection */}
            <ellipse cx="44" cy="36" rx="22" ry="12" fill="white" opacity="0.18" transform="rotate(-30 44 36)" />

            {/* Raised Primary Seam Curve */}
            <path
              d="M 16,38 C 38,52 82,68 104,82"
              fill="none"
              stroke="#500906"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 16,38 C 38,52 82,68 104,82"
              fill="none"
              stroke="url(#seamGlow)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Double-Stitched Seam Threads */}
            <path
              d="M 16,36 C 38,50 82,66 104,80"
              fill="none"
              stroke="#FFF8E7"
              strokeWidth="1.2"
              strokeDasharray="2.5 2.5"
            />
            <path
              d="M 16,40 C 38,54 82,70 104,84"
              fill="none"
              stroke="#FFF8E7"
              strokeWidth="1.2"
              strokeDasharray="2.5 2.5"
            />

            {/* Gold Embossed Crest Stamp */}
            <g transform="translate(68, 38) rotate(15) scale(0.6)" opacity="0.75">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#F5D374" strokeWidth="1.2" />
              <text x="0" y="3" textAnchor="middle" fill="#F5D374" fontSize="7" fontWeight="bold" fontFamily="sans-serif">CSK</text>
              <text x="0" y="8" textAnchor="middle" fill="#F5D374" fontSize="4" fontFamily="sans-serif">2026</text>
            </g>
          </svg>
        </motion.div>

        {/* Floating Master English Willow Cricket Bat (Mid-Left) */}
        <motion.div
          animate={{
            y: [30, -35, 30],
            x: [-15, 15, -15],
            rotate: [-24, -12, -24],
          }}
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
            delay: 1.5,
          }}
          className="absolute top-[40%] left-[3%] w-28 h-80 opacity-[0.3] filter drop-shadow-[0_0_20px_rgba(229,184,66,0.25)] transform-gpu"
        >
          {/* Authentic Cricket Bat SVG */}
          <svg viewBox="0 0 100 320" className="w-full h-full">
            <defs>
              <linearGradient id="handleGrip" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="willowBlade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4A373" />
                <stop offset="25%" stopColor="#FAEDCD" />
                <stop offset="70%" stopColor="#E9D8A6" />
                <stop offset="100%" stopColor="#BC6C25" />
              </linearGradient>
              <linearGradient id="cskSticker" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#082B5C" />
                <stop offset="50%" stopColor="#E5B842" />
                <stop offset="100%" stopColor="#040D1E" />
              </linearGradient>
            </defs>

            {/* Handle Grip */}
            <rect x="44" y="10" width="12" height="90" rx="4" fill="url(#handleGrip)" />
            {/* Grip Rings */}
            {[25, 40, 55, 70, 85].map((y, idx) => (
              <line key={idx} x1="44" y1={y} x2="56" y2={y} stroke="#0B4F8A" strokeWidth="1.5" />
            ))}

            {/* Rubber Handle Cone Top */}
            <path d="M 44,14 C 44,8 56,8 56,14 Z" fill="#E5B842" />

            {/* Blade Shoulders & Body */}
            <path
              d="M 44,100 L 28,125 L 26,290 C 26,305 74,305 74,290 L 72,125 L 56,100 Z"
              fill="url(#willowBlade)"
              stroke="#A67C52"
              strokeWidth="1.5"
            />

            {/* Subtle Wood Grain Lines */}
            <line x1="36" y1="130" x2="36" y2="285" stroke="#B88A58" strokeWidth="0.8" strokeDasharray="30 8 45 12" />
            <line x1="50" y1="125" x2="50" y2="292" stroke="#B88A58" strokeWidth="0.8" strokeDasharray="50 12 30 15" />
            <line x1="64" y1="130" x2="64" y2="285" stroke="#B88A58" strokeWidth="0.8" strokeDasharray="40 10 60 10" />

            {/* CSK Brand Sticker on Shoulder */}
            <polygon points="34,135 66,135 60,200 40,200" fill="url(#cskSticker)" stroke="#E5B842" strokeWidth="1" />
            <text x="50" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">CSK</text>
            <text x="50" y="180" textAnchor="middle" fill="#FFF0B8" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">KINGS</text>

            {/* Colored Toe Guard */}
            <path d="M 26,285 C 26,305 74,305 74,285 Z" fill="#06152F" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Layer 2: Floating Wooden Stumps & Bails (Bottom-Right) */}
      <motion.div style={{ y: yParallax2 }} className="absolute inset-0">
        <motion.div
          animate={{
            y: [-25, 25, -25],
            rotate: [8, -6, 8],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
            delay: 3,
          }}
          className="absolute bottom-24 right-[10%] w-36 h-56 opacity-[0.3] filter drop-shadow-[0_0_20px_rgba(229,184,66,0.25)] transform-gpu"
        >
          {/* Authentic Wooden Stumps SVG */}
          <svg viewBox="0 0 140 200" className="w-full h-full">
            <defs>
              <linearGradient id="stumpWood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9C6644" />
                <stop offset="40%" stopColor="#E6CCB2" />
                <stop offset="100%" stopColor="#7F4F24" />
              </linearGradient>
            </defs>

            {/* Left Stump */}
            <rect x="30" y="45" width="10" height="145" rx="3" fill="url(#stumpWood)" stroke="#582F0E" strokeWidth="0.8" />
            <ellipse cx="35" cy="45" rx="5" ry="2.5" fill="#E5B842" />

            {/* Middle Stump */}
            <rect x="65" y="40" width="10" height="150" rx="3" fill="url(#stumpWood)" stroke="#582F0E" strokeWidth="0.8" />
            <ellipse cx="70" cy="40" rx="5" ry="2.5" fill="#E5B842" />

            {/* Right Stump */}
            <rect x="100" y="45" width="10" height="145" rx="3" fill="url(#stumpWood)" stroke="#582F0E" strokeWidth="0.8" />
            <ellipse cx="105" cy="45" rx="5" ry="2.5" fill="#E5B842" />

            {/* Flying / Floating Bail 1 */}
            <motion.g
              animate={{
                y: [-6, 8, -6],
                rotate: [-15, -5, -15],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <rect x="25" y="30" width="40" height="5" rx="2" fill="#E5B842" stroke="#FFF0B8" strokeWidth="0.8" />
              <rect x="32" y="27" width="8" height="3" rx="1" fill="#FFFFFF" opacity="0.8" />
            </motion.g>

            {/* Floating Bail 2 */}
            <motion.g
              animate={{
                y: [4, -8, 4],
                rotate: [12, 22, 12],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            >
              <rect x="75" y="28" width="40" height="5" rx="2" fill="#E5B842" stroke="#FFF0B8" strokeWidth="0.8" />
              <rect x="90" y="25" width="8" height="3" rx="1" fill="#FFFFFF" opacity="0.8" />
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Layer 3: Floating Golden Stardust / Light Embers */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -220, 0],
            x: [0, i % 2 === 0 ? 35 : -35, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 22 + i * 4,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
            delay: i * 3,
          }}
          className="absolute rounded-full bg-gradient-to-br from-[#FFF8E7] to-[#E5B842] transform-gpu"
          style={{
            width: `${5 + (i % 3) * 2}px`,
            height: `${5 + (i % 3) * 2}px`,
            top: `${18 + i * 12}%`,
            left: `${14 + ((i * 27) % 72)}%`,
            boxShadow: '0 0 16px rgba(229, 184, 66, 0.9)',
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
};
