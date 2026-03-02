import type { Metadata } from "next";
// The component we built

export const metadata: Metadata = {
  title: "Browse Skills",
};
export default function BroswingLayout({
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
