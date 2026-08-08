"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { siteConfig, getInitials } from "@/config/site";
import { routes } from "@/lib/routes";
import { useSecretEntry } from "@/hooks/useSecretEntry";

/**
 * ProfilePhoto
 *
 * The landing hero's portrait — and the hidden entry point to the
 * personal side. It composes `useSecretEntry` for the click logic but
 * stays visually a plain image: no pointer cursor, no button role, no
 * ARIA hint. To every visitor and screen reader it is simply a photo,
 * which is exactly what keeps the easter egg secret.
 *
 * Until `siteConfig.profilePhoto` is set, a tasteful CSS portrait
 * (gradient + initials) stands in so the layout is never broken.
 */
export function ProfilePhoto() {
  const router = useRouter();

  const { onClick } = useSecretEntry({
    onViewer: () => router.push(routes.personalGateway),
    onAuth: () => router.push(routes.personalAuth),
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-sm"
    >
      {/* Soft accent glow behind the frame */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/20 blur-3xl"
      />

      <div
        onClick={onClick}
        // Plain image semantics — no interactive affordance is exposed.
        className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-2xl shadow-black/40"
      >
        {siteConfig.profilePhoto ? (
          <Image
            src={siteConfig.profilePhoto}
            alt={siteConfig.name}
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 384px"
            className="object-cover"
            draggable={false}
          />
        ) : (
          <PortraitFallback />
        )}

        {/* Gentle inner sheen for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/5"
        />
      </div>
    </motion.div>
  );
}

/** CSS-only placeholder portrait shown until a real photo is provided. */
function PortraitFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background:
          "radial-gradient(120% 120% at 30% 20%, var(--aurora-1), transparent 55%), radial-gradient(120% 120% at 80% 90%, var(--aurora-3), transparent 55%), var(--surface)",
      }}
      aria-label={siteConfig.name}
      role="img"
    >
      <span className="font-serif text-7xl text-foreground/90">
        {getInitials()}
      </span>
    </div>
  );
}
