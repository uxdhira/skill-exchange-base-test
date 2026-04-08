import type { Metadata } from "next";

// `Metadata` is a Next.js type.
// We use it so the page title follows the correct Next.js structure.
export const metadata: Metadata = {
  title: "Submit New Skill",
};

/**
 * This layout belongs to the submit-skill section inside the dashboard.
 * It gives this route its own title and keeps the structure ready in case
 * shared UI is needed for create/edit skill pages later.
 *
 * `children` is the form page shown inside this layout.
 */
export default function SubmitSkillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
