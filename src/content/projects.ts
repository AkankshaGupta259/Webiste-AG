import type { Project } from "./types";

/**
 * Project case studies (source-controlled).
 *
 * Prose below is drafted faithfully from Akanksha's resume and bio.
 * 👉 TODO(you): confirm/fill the items marked PLACEHOLDER —
 *    - `timeline` dates
 *    - `links.github` / `links.demo`
 *    - `coverImage` (drop in /public or use a Cloudinary URL)
 *    - expand `architecture` where you want more depth
 * Order in this array = display order on the index.
 */
export const projects: Project[] = [
  {
    slug: "sonic-3d",
    title: "Sonic-3D",
    tagline:
      "Turning static manga panels into immersive spatial-audio video — fully local, no cloud.",
    // timeline: "2025", // (dates intentionally omitted)
    techStack: [
      "Python",
      "PyTorch",
      "MiDaS",
      "OpenCV",
      "NumPy",
      "FFmpeg",
      "Next.js",
    ],
    problem:
      "Transforming 2D manga into an immersive audio experience normally leans on cloud APIs and GPU acceleration. The goal was a pipeline that runs entirely on a local machine — no cloud, no dedicated GPU — while staying inside a strict memory budget.",
    solution:
      "A fully local pipeline that reads a manga panel, estimates depth to place sound in space, extracts dialogue via a customized OCR stage, and synthesizes a spatial-audio video. Text grouping was improved with a Union-Find approach tuned for manga layouts, and video assembly was streamed in-memory to avoid disk bottlenecks.",
    architecture:
      "Panel → MiDaS depth estimation (spatial positioning) → customized EasyOCR with Union-Find text grouping (dialogue extraction) → spatial-audio synthesis → in-memory FFmpeg piping for final muxing. Peak memory held strictly under 8 GB throughout.",
    highlights: [
      "+35% text-grouping accuracy via a Union-Find OCR customization",
      "−40% end-to-end processing time using in-memory FFmpeg piping (no disk I/O)",
      "Peak memory kept strictly under 8 GB — runs without cloud APIs or a GPU",
    ],
    links: {
      // github: "PLACEHOLDER",
      // demo: "PLACEHOLDER",
    },
    featured: true,
  },
  {
    slug: "isl-smart-glasses",
    title: "Real-time ISL Recognition on Smart Glasses",
    tagline:
      "Real-time Indian Sign Language recognition on Ray-Ban Meta smart glasses, for accessibility.",
    // timeline: "2025 – Present", // (dates intentionally omitted)
    techStack: [
      "Computer Vision",
      "Pose Estimation",
      "Hand Landmarks",
      "Python",
      "Real-time Inference",
    ],
    problem:
      "The deaf and hard-of-hearing community lacks unobtrusive, real-time tools to bridge sign language into everyday interactions. Recognizing Indian Sign Language on a wearable, with low enough latency to feel live, is an open challenge.",
    solution:
      "A recognition system built for Ray-Ban Meta smart glasses that combines pose estimation and hand-landmark extraction with a low-latency inference path, so signs are interpreted in real time from the wearer's point of view.",
    architecture:
      "Smart-glasses capture → pose estimation + hand-landmark extraction → temporal sign model → low-latency inference. PLACEHOLDER — expand with your model/latency details.",
    highlights: [
      "Focused on accessibility for the deaf community",
      "Combines pose estimation, hand-landmark extraction, and low-latency inference",
      "Research in progress at IIIT Sri City",
    ],
    links: {
      // github: "PLACEHOLDER",
    },
    featured: true,
  },
  {
    slug: "multilingual-tokenizer",
    title: "Multilingual Tokenization Engine",
    tagline:
      "A fairness-audited BPE tokenizer for English, Hindi, and Hinglish, with an explainability dashboard.",
    // timeline: "2024", // (dates intentionally omitted)
    techStack: [
      "Python",
      "FastAPI",
      "Next.js",
      "Streamlit",
      "Scikit-learn",
      "NLTK",
    ],
    problem:
      "Sub-word tokenizers often treat scripts unequally, fragmenting Hindi and Hinglish more aggressively than English. That imbalance quietly penalizes multilingual models — and it's rarely measured.",
    solution:
      "A BPE sub-word tokenizer with script-aware pre-tokenization for English, Hindi, and Hinglish, paired with a fairness-audit pipeline and an interactive explainability dashboard that surfaces tokenization parity across scripts.",
    architecture:
      "Script-aware pre-tokenization → BPE training → fairness-audit metrics → interactive dashboard (Streamlit/Next.js) over a FastAPI service. Robustness validated against typographic errors and OCR noise.",
    highlights: [
      "Script-aware tokenization across English, Hindi, and Hinglish",
      "Fairness-audit pipeline + interactive explainability dashboard",
      "Stress-tested against typos and OCR noise for reliable inference",
    ],
    links: {
      // github: "PLACEHOLDER",
      // demo: "PLACEHOLDER",
    },
    featured: false,
  },
  {
    slug: "realtime-chat",
    title: "Real-time Chat Platform",
    tagline:
      "A responsive real-time chat platform with sub-100ms delivery for 50+ concurrent users.",
    // timeline: "2024", // (dates intentionally omitted)
    techStack: ["Next.js", "Supabase", "PostgreSQL", "Tailwind CSS"],
    problem:
      "Real-time chat has to keep many clients in sync with minimal latency while staying responsive across devices and handling sessions securely.",
    solution:
      "A full-stack chat platform using Supabase WebSocket subscriptions for instant updates over PostgreSQL, with secure user sessions and a clean, responsive Tailwind UI.",
    architecture:
      "Next.js client → Supabase realtime (WebSocket subscriptions) → PostgreSQL. Secure sessions and optimistic updates keep all clients coordinated.",
    highlights: [
      "50+ concurrent users with instant, coordinated updates",
      "Sub-100ms latency; ~40% lower message-delivery delay",
      "Responsive across 3+ device types",
    ],
    links: {
      github: "https://github.com/AkankshaGupta259/chat",
      demo: "https://dummychat.vercel.app/",
    },
    featured: false,
  },
];

/** All projects in display order. */
export function getAllProjects(): Project[] {
  return projects;
}

/** Look up a single project by slug (for the case-study route). */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
