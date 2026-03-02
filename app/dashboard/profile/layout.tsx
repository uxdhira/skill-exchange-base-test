import type { Metadata } from "next";
// The component we built

export const metadata: Metadata = {
  title: "Profile",
};
export default function ProfileLayout({
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
