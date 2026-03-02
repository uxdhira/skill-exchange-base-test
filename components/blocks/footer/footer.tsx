import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Zap, Twitter, Linkedin, Dribbble, Instagram } from "lucide-react";

type FooterData = {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
};

const footerSections: FooterData[] = [
  {
    title: "Links",
    links: [
      {
        title: "Home",
        href: "/#",
      },

      {
        title: "How It Works",
        href: "/#how-it-works",
      },

      {
        title: "Skills",
        href: "/#skill-categories",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="py-10">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="flex flex-col gap-6 sm:gap-12">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-12 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full lg:col-span-4">
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                {/* Logo */}

                <div>
                  <Link href="/" className="flex items-center gap-3">
                    {/* Purple Icon */}
                    <Zap size={38} className="text-purple-700" />

                    {/* Deep Blue Text */}
                    <span className="text-2xl font-bold text-blue-950">
                      SkillSpill
                    </span>
                  </Link>
                </div>

                <p className="text-base font-normal text-muted-foreground">
                  Growing stronger through shared knowledge — because everyone
                  has something to teach.
                </p>

                {/* social links */}
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Dribbble size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:block hidden"></div>

            {footerSections.map(({ title, links }, index) => (
              <div key={index} className="col-span-2">
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                  <p className="text-base font-medium text-foreground">
                    {title}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {links.map(({ title, href }) => (
                      <li key={title}>
                        <Link
                          href={href}
                          className="text-base font-normal text-muted-foreground hover:text-foreground"
                        >
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="col-span-3">
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                <p className="text-base font-medium text-foreground">
                  Contact Details
                </p>
                <ul className="flex flex-col gap-3">
                  <li>
                    <p className="text-base font-normal text-muted-foreground">
                      40‑C Cavalary Ground Commercial Area, Islamabad 44000,
                      Pakistan
                    </p>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@example.com"
                      className="text-base font-normal text-muted-foreground hover:text-foreground"
                    >
                      hello@skillspill.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+921051923556"
                      className="text-base font-normal text-muted-foreground hover:text-foreground"
                    >
                      +92 51 192 3556
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <p className="text-sm font-normal text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
            ©2026 SkillSpill. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
