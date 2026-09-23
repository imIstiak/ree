"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

// The "Find your story" tiles as cloth patches. This is the landing page's motion island
// (Framer Motion, published as `motion`): the page stays a server component and passes the
// already-rendered image and caption in as props, so next/image still renders on the server.

export type StoryTileProps = {
  id: string;
  // short: caption below. tall: no caption. hung: bottom-aligned with the caption above.
  shape: "short" | "tall" | "hung";
  // Resting tilt in degrees; hover straightens it.
  tilt: number;
  // Cloth colour and stitch colour as full class literals (Tailwind needs to see them whole).
  frame: string;
  caption?: ReactNode;
  image: ReactNode;
};

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const tile = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } },
} as const;

const patch = {
  hover: { rotate: 0, y: -6, scale: 1.02, transition: { type: "spring", stiffness: 260, damping: 18 } },
} as const;

const picture = {
  hover: { scale: 1.06, transition: { type: "spring", stiffness: 200, damping: 20 } },
} as const;

export function StoryTiles({ tiles }: { tiles: StoryTileProps[] }) {
  return (
    // reducedMotion="user" drops the transform animations (keeps the fades) under prefers-reduced-motion.
    <MotionConfig reducedMotion="user">
      <motion.ul
        className="grid grid-cols-2 items-start gap-5 border-t border-lp-border px-[3%] py-[3%] lg:grid-cols-5 lg:gap-x-[1.6%]"
        variants={list}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {tiles.map((t) => (
          <motion.li key={t.id} id={t.id} variants={tile} className={`scroll-mt-4 ${t.shape === "hung" ? "self-end" : ""}`}>
            <a href="#collection" className="block">
              {t.shape === "hung" && <div className="mb-2">{t.caption}</div>}
              <motion.div
                className={`relative p-2 shadow-lg shadow-black/40 outline-1 outline-dashed -outline-offset-4 transition-shadow duration-500 group-data-[lp-theme=light]/theme:shadow-black/15 before:pointer-events-none before:absolute before:inset-0 before:lp-noise before:opacity-25 before:mix-blend-overlay before:content-[''] hover:shadow-2xl sm:p-2.5 sm:-outline-offset-[5px] ${t.frame}`}
                style={{ rotate: t.tilt }}
                variants={patch}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
              >
                <div className={`relative overflow-hidden ${t.shape === "tall" ? "aspect-[57/75]" : "aspect-[57/48]"}`}>
                  <motion.div className="absolute inset-0" variants={picture}>
                    {t.image}
                  </motion.div>
                </div>
              </motion.div>
              {t.shape === "short" && <div className="mt-2">{t.caption}</div>}
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </MotionConfig>
  );
}
