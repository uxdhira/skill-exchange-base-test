import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Skills",
};
export default function BroswingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
