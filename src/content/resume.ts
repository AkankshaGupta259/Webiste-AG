import type { ResumeData } from "./types";

/**
 * Experience & Expertise content (source-controlled).
 *
 * FLAGS for review (from To-Do-1):
 *  - HCI Sri City & RBI "View certificate" are intentionally hidden until
 *    real files exist (certificate left unset).
 *  - Role résumé PDFs (SDE / AI-ML / Management) not provided yet → the
 *    download dialog shows "coming soon" per role until they're in /public.
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
      role: "Research Intern — HCI Lab",
      org: "IIIT Sri City",
      type: "Research Internship",
      location: "Onsite",
      start: "May 2026",
      end: "Jul 2026",
      bullets: [
        "Collaborated with a multidisciplinary team to design and build wearable AI applications for accessibility, applying strong problem-solving and object-oriented programming practices.",
        "Implemented, tested, and performance-optimized multiple pipelines, benchmarking model architectures across accuracy, latency, and deployment efficiency.",
        "Owned technical documentation and reproducible workflows using Python and Git, following Agile-style iterative development.",
      ],
      // certificate: hidden placeholder — no file yet (do not show on site).
    },
    {
      role: "Software Development Intern",
      org: "Lumovate Intelligence",
      type: "Full Stack Development",
      location: "Remote",
      start: "Feb 2025",
      end: "Apr 2025",
      bullets: [
        "Built full-stack web application features end-to-end using React, Next.js, and MongoDB, working across both front-end and back-end layers.",
        "Designed and implemented RESTful APIs with Next.js API routes integrated with MongoDB for scalable, dynamic data handling, and collaborated with the team using Git in an Agile workflow.",
        "Translated UI/UX design requirements into responsive, production-ready front-end components, ensuring cross-browser performance and maintainability.",
      ],
      certificate: "lumovate-internship",
    },
  ],

  leadership: [
    {
      role: "RBI Youth Ambassador",
      org: "Reserve Bank of India",
      type: "Student Leadership",
      location: "Onsite",
      start: "Nov 2025",
      end: "Present",
      bullets: [
        "Managed end-to-end planning and execution of 4+ financial literacy sessions, coordinating with 150+ participants and ensuring smooth, on-schedule delivery.",
        "Acted as the primary point of contact between RBI officials and institute stakeholders, streamlining communication and reducing coordination delays across the project timeline.",
        "Collaborated with a 6-member cross-functional team to design and execute outreach initiatives with clear timelines and individual responsibilities.",
        "Handled ambiguous, on-ground challenges and last-minute changes, independently identifying practical solutions while keeping all stakeholders informed.",
      ],
      // certificate: hidden placeholder — no file yet (do not show on site).
    },
    {
      role: "Joint Technical Secretary",
      org: "IIIT Manipur",
      type: "Student Technical Leadership",
      location: "Onsite",
      start: "Aug 2024",
      end: "Oct 2025",
      bullets: [
        "Led end-to-end planning and execution of multiple technical events and workshops, managing schedules, logistics, budgets, and stakeholder coordination.",
        "Organized AHOUBA TechFest — the largest in the state of Manipur — coordinating cross-functional teams across colleges to drive high participation.",
        "Collaborated with faculty and student teams to prioritize tasks, manage project scope and timelines, and ensure on-time delivery of outcomes.",
      ],
      certificate: "joint-technical-secretary",
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

  certifications: [
    {
      title: "Business Intelligence and Analytics",
      issuer: "Swayam (NPTEL)",
      year: "2026",
      bullets: [
        "Gained foundational knowledge in business analytics, data-driven decision making, and problem solving.",
        "Worked with analytical approaches to interpret data and support strategic decision-making.",
      ],
      certificate: "business-intelligence-analytics",
    },
    {
      title: "Data Science and Analysis",
      bullets: [
        "Learned core concepts of data analysis, data interpretation, and visualization.",
        "Applied basic analytical techniques to derive insights and improve decision-making processes.",
      ],
      certificate: "data-analytics",
    },
    {
      title: "Blockchain and Its Applications",
      issuer: "Swayam (NPTEL)",
      year: "2026",
      bullets: [
        "Studied blockchain fundamentals — distributed ledgers, consensus mechanisms, and smart contracts.",
        "Explored real-world applications of blockchain across security, finance, and decentralised systems.",
      ],
      certificate: "blockchain-applications",
    },
    {
      title: "Getting Started with Competitive Programming",
      issuer: "Swayam (NPTEL)",
      year: "2025",
      bullets: [
        "Built a foundation in competitive programming — core data structures, algorithmic patterns, and complexity analysis.",
        "Practised solving timed problems efficiently, strengthening problem decomposition and optimisation.",
      ],
      certificate: "competitive-programming-nptel",
    },
    {
      title: "Powers of AI",
      issuer: "Saras Institute",
      bullets: [
        "Explored practical applications of modern AI tools across research, productivity, and creative workflows.",
        "Developed intuition for effective prompting and integrating AI into everyday problem-solving.",
      ],
      certificate: "saras-powers-of-ai",
    },
  ],

  achievements: [
    {
      text: "First Prize — Fenomenon'25 Ideathon (Aero-5G, an ATC concept for ultra-low-altitude drones).",
      href: "/portfolio/college/fenomenon-25-ideathon",
    },
    {
      text: "Third Place — Flipr Hackathon.",
      href: "/portfolio/college/flipr-hackathon",
    },
  ],

  research: [],

  // Drop role-specific PDFs in /public and set the paths to enable the
  // download options (e.g. sde: "/resume/akanksha-sde.pdf").
  resumesByRole: {
    // sde: "/resume/akanksha-sde.pdf",
    // aiml: "/resume/akanksha-aiml.pdf",
    // management: "/resume/akanksha-management.pdf",
  },
};
