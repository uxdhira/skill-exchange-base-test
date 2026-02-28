
import Features from "@/components/shadcn-space/blocks/feature/howwork";
import Footer from "@/components/shadcn-space/blocks/footer/footer";
import AgencyHeroSection from "@/components/shadcn-space/blocks/hero";
import Skills from "@/components/shadcn-space/blocks/category/explorecategory";
import Header, { NavigationSection } from "@/components/ui/header";
  
   
export default function Home() {
  return (
  <>   <AgencyHeroSection/> <Features/><Skills/> </>
  );
}
