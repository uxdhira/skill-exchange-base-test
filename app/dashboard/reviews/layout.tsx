import type { Metadata } from "next";

// `Metadata` is a Next.js type.
// We use it so the page title follows the correct Next.js structure.
export const metadata: Metadata = {
  title: "Reviews",
};

/**
 * This layout belongs to the reviews section inside the dashboard.
 * It sets route-specific metadata and gives us a clean place to add
 * shared review-page structure later.
 *
 * `children` is the actual reviews page content shown inside this layout.
 */
export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
