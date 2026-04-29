"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Particle = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function HeroBackdrop() {
  const particles = React.useMemo<Particle[]>(() => {
    const rand = mulberry32(2026);
    return Array.from({ length: 18 }).map((_, i) => {
      const size = Math.floor(4 + rand() * 10);
      return {
        id: i,
        left: `${Math.floor(rand() * 100)}%`,
        top: `${Math.floor(rand() * 100)}%`,
        size,
        delay: rand() * 1.5,
        duration: 4.5 + rand() * 3.5,
        opacity: 0.18 + rand() * 0.35,
      };
    });
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(0,240,255,0.22),transparent_70%),radial-gradient(60%_45%_at_0%_40%,rgba(255,107,0,0.18),transparent_62%),radial-gradient(55%_45%_at_100%_55%,rgba(0,240,255,0.14),transparent_62%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,10,18,0.0),rgba(7,10,18,0.85))]" />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background:
              p.id % 3 === 0
                ? "rgba(255,107,0,0.95)"
                : "rgba(0,240,255,0.95)",
            filter: "blur(0.5px)",
          }}
          initial={{ y: 0, x: 0, scale: 1 }}
          animate={{
            y: [0, -22, 0],
            x: [0, p.id % 2 === 0 ? 10 : -10, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

