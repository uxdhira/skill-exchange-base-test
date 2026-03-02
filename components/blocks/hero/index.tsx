import HeroSection from "@/components/blocks/hero/hero";
import type { NavigationSection } from "@/components/ui/header";
import Header from "@/components/ui/header";
import BrandSlider from "@/components/blocks/hero/brand-slider";
import type { AvatarList } from "@/components/blocks/hero/hero";
import {
  SiCss3,
  SiHtml5,
  SiNextdotjs,
  SiStrapi,
  SiWritedotas,
} from "react-icons/si";
import { brandListType } from "@/types";

export default function AgencyHeroSection() {
  const avatarList: AvatarList[] = [
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-1.jpg",
    },
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-2.jpg",
    },
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
    },
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-5.jpg",
    },
  ];

  const brandList: brandListType[] = [
    {
      icon: <SiNextdotjs />,
      name: "Brand 1",
    },
    {
      icon: <SiHtml5 />,
      name: "Brand 1",
    },

    {
      icon: <SiCss3 />,
      name: "Brand 1",
    },

    {
      icon: <SiStrapi />,

      name: "Brand 4",
    },
    {
      icon: <SiWritedotas />,

      name: "Brand 5",
    },
  ];

  return (
    <div className="relative">
      <main>
        <HeroSection avatarList={avatarList} />
        <BrandSlider brandList={brandList} />
      </main>
    </div>
  );
}
