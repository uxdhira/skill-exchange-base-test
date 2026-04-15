import type { Metadata } from "next";

// `Metadata` is a Next.js type.
// We use it so the page title follows the correct Next.js structure.
export const metadata: Metadata = {
  title: "Booking Details",
};

/**
 * This layout belongs to the profile section inside the dashboard.
 * It mainly sets the page title for this route and can later hold
 * shared profile-related UI if needed.
 *
 * `children` means the page component rendered inside this layout.
 */
export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
