"use client";

import { motion, useReducedMotion } from "motion/react";
import type { IllustrationName } from "../data/products";

// Line illustrations for the story chapters, drawn in the icon set's style (thin stroke, one path
// per stroke) on a 240-unit grid. Each path draws itself as it scrolls into view.
type Stroke = { d: string; dashed?: boolean };
type Word = { x: number; y: number; value: string; size: number };

const art: Record<IllustrationName, { strokes: Stroke[]; words?: Word[] }> = {
  hourglass: {
    strokes: [
      { d: "M70 34h100" },
      { d: "M70 206h100" },
      { d: "M78 34v172" },
      { d: "M162 34v172" },
      { d: "M86 40c0 34 26 52 26 80s-26 46-26 80" },
      { d: "M154 40c0 34-26 52-26 80s26 46 26 80" },
      { d: "M100 92q20 10 40 0" },
      { d: "M94 200q26-30 52 0" },
      { d: "M120 118v10" },
      { d: "M120 136v8" },
      { d: "M120 152v6" },
      { d: "M42 78v12M37 84h10" },
      { d: "M198 148v12M193 154h10" },
    ],
  },
  cotton: {
    strokes: [
      { d: "M120 232V150" },
      { d: "M120 190c-24 0-40-14-44-36 22 0 40 14 44 36Z" },
      { d: "M120 172c24 0 40-14 44-36-22 0-40 14-44 36Z" },
      { d: "M96 126a18 18 0 1 0 36 0a18 18 0 1 0-36 0" },
      { d: "M110 104a18 18 0 1 0 36 0a18 18 0 1 0-36 0" },
      { d: "M124 126a18 18 0 1 0 36 0a18 18 0 1 0-36 0" },
      { d: "M110 140a16 16 0 1 0 32 0a16 16 0 1 0-32 0" },
      { d: "M100 150l-8 14M156 150l8 14M128 158v14" },
      { d: "M176 176h36v40h-36z" },
      { d: "M178 184h32M178 192h32M178 200h32M178 208h32", dashed: true },
      { d: "M172 176h44M172 216h44" },
      { d: "M40 210l60-60" },
      { d: "M96 150a4 4 0 1 0 8 0a4 4 0 1 0-8 0" },
      { d: "M44 214c40 20 100 10 132-4", dashed: true },
    ],
  },
  cut: {
    strokes: [
      { d: "M60 90 40 110l16 16 14-8v88h100v-88l14 8 16-16-20-20" },
      { d: "M92 84c0 12 12 20 28 20s28-8 28-20" },
      { d: "M60 90c10-6 22-8 32-6M180 90c-10-6-22-8-32-6" },
      { d: "M74 98l-6 20", dashed: true },
      { d: "M166 98l6 20", dashed: true },
      { d: "M70 118h100", dashed: true },
      { d: "M48 160h144M48 154v12M192 154v12" },
      { d: "M222 84v122M216 84h12M216 206h12" },
    ],
    words: [{ x: 120, y: 228, value: "chest 56 · length 70", size: 9 }],
  },
  print: {
    strokes: [
      { d: "M40 60h160v110H40z" },
      { d: "M52 72h136v86H52z" },
      { d: "M52 90h136M52 108h136M52 126h136M52 144h136", dashed: true },
      { d: "M64 52l112-20" },
      { d: "M120 42V18" },
      { d: "M108 18h24" },
      { d: "M70 176v14M120 176v10M170 176v18" },
    ],
    words: [{ x: 120, y: 124, value: "LIFE IS SHORT", size: 18 }],
  },
  stitch: {
    strokes: [
      { d: "M40 100c40-12 120-12 160 0v84c-40 12-120 12-160 0z" },
      { d: "M56 142h128", dashed: true },
      { d: "M56 168h128", dashed: true },
      { d: "M150 58l38 38" },
      { d: "M184 92a5 5 0 1 0 10 0a5 5 0 1 0-10 0" },
      { d: "M190 98c30 12 22 44 6 44", dashed: true },
      { d: "M60 40a14 14 0 0 1 28 0v22H60z" },
      { d: "M66 50v.1M74 46v.1M82 50v.1" },
      { d: "M36 60l8-6M36 72h10" },
    ],
  },
  day: {
    strokes: [
      { d: "M24 176h192" },
      { d: "M44 176a76 76 0 0 1 152 0", dashed: true },
      { d: "M146 110a12 12 0 1 0 24 0a12 12 0 1 0-24 0" },
      { d: "M158 90v-8M158 130v8M138 110h-8M178 110h8M144 96l-6-6M172 124l6 6M172 96l6-6M144 124l-6 6" },
      { d: "M86 96a14 14 0 1 0 0 28a11 11 0 1 1 0-28Z" },
      { d: "M100 190h40l-5 24h-30z" },
      { d: "M140 196c10 0 10 14 0 14" },
      { d: "M110 184c4-6-4-8 0-14M120 184c4-6-4-8 0-14M130 184c4-6-4-8 0-14" },
      { d: "M40 60v8M36 64h8" },
      { d: "M200 44v8M196 48h8" },
    ],
  },
};

export function Illustration({ name, className = "" }: { name: IllustrationName; className?: string }) {
  const reduce = useReducedMotion();
  const { strokes, words } = art[name];
  return (
    <svg viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {strokes.map((stroke, i) => (
        <motion.path
          key={i}
          d={stroke.d}
          strokeDasharray={stroke.dashed ? "4 5" : undefined}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, delay: 0.1 * i, ease: "easeInOut" }}
        />
      ))}
      {words?.map((word) => (
        <motion.text
          key={word.value}
          x={word.x}
          y={word.y}
          textAnchor="middle"
          fontSize={word.size}
          fontFamily="var(--font-lp-display)"
          letterSpacing=".06em"
          fill="currentColor"
          stroke="none"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 * strokes.length }}
        >
          {word.value}
        </motion.text>
      ))}
    </svg>
  );
}
