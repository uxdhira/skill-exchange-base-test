import type { Metadata } from "next";

// `Metadata` is a Next.js type.
// We use it so the page title follows the correct Next.js structure.
export const metadata: Metadata = {
  title: "Bookings",
};

/**
 * This layout belongs to the bookings section inside the dashboard.
 * Right now it does not add extra UI, but it still gives this route
 * its own page title and a place for future shared layout changes.
 *
 * `children` means the actual page content that will be shown inside this layout.
 */
export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
