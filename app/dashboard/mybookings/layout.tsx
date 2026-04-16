import type { Metadata } from "next";

// `Metadata` is a Next.js type.
// We use it so the page title follows the correct Next.js structure.
export const metadata: Metadata = {
  title: "My Bookings",
};

/**
 * This layout belongs to the skills section inside the dashboard.
 * It currently passes the page through directly, but it still helps by
 * setting the route title and giving this section its own layout file.
 *
 * `children` means the page content inside the skills route.
 */
export default function mybookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
