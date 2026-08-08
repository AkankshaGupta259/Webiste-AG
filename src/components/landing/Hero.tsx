"use client";

import { motion, type Variants } from "motion/react";
import { siteConfig } from "@/config/site";
import { ProfilePhoto } from "./ProfilePhoto";
import { ExploreButton } from "./ExploreButton";

/**
 * Landing hero — a calm, two-column composition:
 * portrait on the left, text on the right (≥ md); on smaller screens the
 * columns stack with the portrait on top. The portrait comes first in the
 * DOM, which gives the correct order in both layouts without needing to
 * reorder with CSS. Content fades/slides in with a gentle stagger;
 * `motion` honours reduced-motion preferences automatically.
 */

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl items-center px-6 py-20 sm:px-8">
      <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Portrait column (left on desktop, top on mobile) */}
        <div className="flex justify-center md:justify-start">
          <ProfilePhoto />
        </div>

        {/* Text column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start text-left"
        >
          <motion.p
            variants={item}
            className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent"
          >
            {siteConfig.role}
          </motion.p>

          <motion.h1
            variants={item}
            className="text-balance font-serif text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-pretty text-lg text-foreground-muted"
          >
            {siteConfig.intro}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-md text-pretty text-base leading-relaxed text-foreground-subtle"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div variants={item} className="mt-9">
            <ExploreButton />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
