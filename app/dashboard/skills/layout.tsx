import type { Metadata } from "next";
// The component we built

export const metadata: Metadata = {
  title: "Skills",
};
export default function SkillsLayout({
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
