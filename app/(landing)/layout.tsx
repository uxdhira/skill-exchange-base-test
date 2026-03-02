import Footer from "@/components/blocks/footer/footer";
import Header, { NavigationSection } from "@/components/ui/header";
import { MockStateProvider } from "@/hooks/useGlobalState";
const navigationData: NavigationSection[] = [
  {
    title: "Home",
    href: "#",
    isActive: true,
  },
  {
    title: "How It Works",
    href: "#how-it-works",
  },
  {
    title: "Skills",
    href: "#skill-categories",
  },
];
// (landing)/layout.tsx
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MockStateProvider>
        <Header navigationData={navigationData} />
        {children}
      </MockStateProvider>
      <Footer />
    </>
  );
}
