import Footer from "@/components/shadcn-space/blocks/footer/footer";
import Header, { NavigationSection } from "@/components/ui/header";
 const navigationData: NavigationSection[] = [
     {
       title: "Home",
       href: "#",
       isActive: true,
     },
     
     {
       title: "How It Works",
       href:"#how-it-works",
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
    <>   <Header navigationData={navigationData} />
      {children}
      <Footer />
    </>
  );
}