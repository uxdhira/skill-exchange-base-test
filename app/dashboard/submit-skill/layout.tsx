import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit New Skill",
};
export default function SubmitSkillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
