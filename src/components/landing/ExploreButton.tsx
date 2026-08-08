"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { routes } from "@/lib/routes";

/**
 * Primary landing CTA → the professional portfolio dashboard.
 * A calm, premium pill with a subtly advancing arrow on hover.
 * Fully accessible: it's a real link, keyboard-focusable, with a
 * visible focus ring.
 */
export function ExploreButton() {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="inline-block">
      <Link
        href={routes.portfolio}
        className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-foreground px-7 py-3 text-sm font-medium text-background transition-colors duration-300 hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Explore
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </motion.div>
  );
}
