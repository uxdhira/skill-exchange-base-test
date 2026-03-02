import type { Metadata } from "next";
// The component we built

export const metadata: Metadata = {
  title: "Reviews",
};
export default function ReviewsLayout({
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
