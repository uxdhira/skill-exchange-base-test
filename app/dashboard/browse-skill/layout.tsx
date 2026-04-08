import type { Metadata } from "next";

// `Metadata` is a Next.js type.
// We use it so the page title follows the correct Next.js structure.
export const metadata: Metadata = {
  title: "Browse Skills",
};

/**
 * This layout belongs to the browse-skill section inside the dashboard.
 * It is useful for setting route-specific metadata and for adding shared
 * UI later if this section grows.
 *
 * `children`  represents the actual page content rendered inside that  this layout wraps.
 */
export default function BroswingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
