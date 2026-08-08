import type { Metadata } from "next";
import {
  SectionHeading,
  SectionPlaceholder,
} from "@/components/portfolio/SectionHeading";

export const metadata: Metadata = { title: "School Activities" };

export default function SchoolPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Before college"
        title="School Activities"
        lead="Achievements and activities from school, kept visually consistent with the rest of the portfolio."
      />
      <SectionPlaceholder note="Content for this section is still to come — share your school achievements and activities and we'll add them here." />
    </div>
  );
}
