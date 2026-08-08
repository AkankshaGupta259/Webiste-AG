import type { ResumeData } from "./types";

/**
 * Resume content (source-controlled). Seeded from Akanksha's resume —
 * PDF preferred over the docx on conflicts (e.g. CPI 9.58, not 9.57).
 *
 * 👉 TODO(you):
 *   - Provide a FINAL resume PDF (drop in /public) and set `resumePdf`
 *     so the Download button appears. (Data/Resume_Akanksha.pdf is a draft.)
 *   - Confirm the skills list (this uses the PDF's, which is more current).
 *   - Add research entries if you want a Research section.
 */
export const resume: ResumeData = {
  summary:
    "An inquisitive Computer Science undergraduate passionate about software engineering, problem-solving, and learning new technologies. Actively involved in university tech clubs and coding competitions, and eager to apply academic knowledge to real-world challenges.",

  skills: [
    { label: "Languages", items: ["C", "C++", "JavaScript", "Python", "PHP", "SQL"] },
    {
      label: "AI / ML",
      items: ["NLP", "Data Processing", "Text Analysis", "Computer Vision", "OpenCV"],
    },
    {
      label: "Frameworks",
      items: ["React", "Node.js", "Next.js", "Tailwind CSS", "FastAPI"],
    },
    { label: "Databases", items: ["MySQL", "Supabase", "MongoDB"] },
    { label: "Tools & Platforms", items: ["Git", "Figma", "Vercel", "Linux"] },
  ],

  experience: [
    {
      role: "Software Development Intern",
      org: "Lumovate Intelligence",
      type: "Internship · Remote",
      start: "Feb 2025",
      end: "Apr 2025",
      bullets: [
        "Built RESTful APIs with Next.js API routes integrated with MongoDB for dynamic data handling.",
        "Translated design requirements into responsive, production-ready UI components.",
        "Collaborated with the team to deliver scalable, efficient full-stack features.",
      ],
    },
    {
      role: "Joint Technical Secretary",
      org: "IIIT Manipur",
      type: "Leadership · On-site",
      start: "Aug 2024",
      end: "Oct 2025",
      bullets: [
        "Spearheaded end-to-end coordination of technical events, managing cross-functional teams.",
        "Organized TechFest AHOUBA — the largest fest in the state of Manipur.",
        "Collaborated with peers and faculty on workshops and knowledge-sharing sessions.",
      ],
    },
  ],

  education: [
    {
      institution: "Indian Institute of Information Technology, Manipur",
      qualification: "B.Tech in Computer Science and Engineering",
      detail: "CPI: 9.58",
      location: "Imphal, Manipur",
      start: "Aug 2023",
      end: "2027",
    },
    {
      institution: "Scholars Home Senior Secondary School",
      qualification: "Senior Secondary (Class 12) — PCM with Computer Science",
      detail: "92.4%",
      location: "Dehradun",
      start: "",
      end: "2023",
    },
    {
      institution: "Scholars Home Senior Secondary School",
      qualification: "Secondary (Class 10)",
      detail: "98.4%",
      location: "Dehradun",
      start: "",
      end: "2021",
    },
  ],

  achievements: [
    "First Prize — Fenomenon'25 Ideathon (Aero-5G, an ATC concept for ultra-low-altitude drones).",
    "Third Place — Flipr Hackathon.",
  ],

  research: [],

  // resumePdf: "/Akanksha-Gupta-Resume.pdf", // set once the final PDF is in /public
};
