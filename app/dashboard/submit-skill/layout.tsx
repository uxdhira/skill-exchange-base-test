import type { Metadata } from "next";
// The component we built

export const metadata: Metadata = {
  title: "Submit New Skill",
};
export default function SubmitSkillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Page Content */}
      {children}
    </>
  );
}
