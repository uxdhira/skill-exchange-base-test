import type { Metadata } from "next";
// The component we built

export const metadata: Metadata = {
  title: "Bookings",
};
export default function BookingsLayout({
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
