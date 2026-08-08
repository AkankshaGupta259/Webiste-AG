"use client";

import { useCallback, useEffect, useRef } from "react";

export interface SecretEntryOptions {
  /** Clicks that open the personal viewer gateway (default 3). */
  viewerClicks?: number;
  /** Clicks that open the password page (default 5). */
  authClicks?: number;
  /**
   * Max gap (ms) allowed between clicks. The count is evaluated once the
   * user *stops* clicking for this long. Evaluating on a trailing pause —
   * rather than on a specific click number — is what lets a 5-click
   * sequence reach the auth page without tripping the 3-click viewer route
   * on the way there.
   */
  window?: number;
  /** Fired when the trailing count lands in the viewer range. */
  onViewer: () => void;
  /** Fired when the trailing count lands in the auth range. */
  onAuth: () => void;
}

export interface SecretEntryHandlers {
  /** Attach to the secret element's onClick. */
  onClick: () => void;
}

/**
 * Headless hook implementing the hidden profile-photo interaction.
 *
 * Deliberately UI-agnostic: it exposes only a click handler and knows
 * nothing about how the trigger looks. This keeps the trigger element
 * a plain, accessible image (no button semantics, no focus ring, no
 * ARIA hint) so the feature stays genuinely hidden, while the logic
 * itself remains easy to reason about and test in isolation.
 *
 * Thresholds are inclusive-and-forgiving: `>= authClicks` wins first,
 * otherwise `>= viewerClicks`, otherwise the sequence silently resets.
 */
export function useSecretEntry({
  viewerClicks = 3,
  authClicks = 5,
  window: windowMs = 600,
  onViewer,
  onAuth,
}: SecretEntryOptions): SecretEntryHandlers {
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the latest callbacks without forcing the handler to be recreated.
  const onViewerRef = useRef(onViewer);
  const onAuthRef = useRef(onAuth);
  useEffect(() => {
    onViewerRef.current = onViewer;
    onAuthRef.current = onAuth;
  }, [onViewer, onAuth]);

  const evaluate = useCallback(() => {
    const count = countRef.current;
    countRef.current = 0;
    timerRef.current = null;

    if (count >= authClicks) {
      onAuthRef.current();
    } else if (count >= viewerClicks) {
      onViewerRef.current();
    }
    // Fewer than viewerClicks → a normal click; do nothing.
  }, [authClicks, viewerClicks]);

  const onClick = useCallback(() => {
    countRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(evaluate, windowMs);
  }, [evaluate, windowMs]);

  // Clean up any pending timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { onClick };
}
