"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, Search, UserPlus } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description:
      "Sign up and list the skills you can offer. Tell others what you'd like to learn in return.",
    icon: <UserPlus className="h-6 w-6 text-blue-700" />,
    iconBg: "bg-blue-200",
    cardBg: "bg-blue-50",
  },
  {
    id: 2,
    title: "Find Skills",
    description:
      "Browse through available skills in your area. Filter by category, location, and skill level.",
    icon: <Search className="h-6 w-6 text-green-700" />,
    iconBg: "bg-green-200",
    cardBg: "bg-green-50",
  },
  {
    id: 3,
    title: "Start Exchanging",
    description:
      "Send booking requests, agree on a time, and start exchanging skills with community members.",
    icon: <ArrowLeftRight className="h-6 w-6 text-purple-700" />,
    iconBg: "bg-purple-200",
    cardBg: "bg-purple-50",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="my-10 py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold mb-16 text-slate-900">
          How It Works
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card
              key={step.id}
              className={`border-none shadow-sm hover:shadow-md transition-shadow ${step.cardBg}`}
            >
              <CardHeader className="flex flex-col items-center pt-8">
                {/* Icon Circle */}
                <div className={`${step.iconBg} p-4 rounded-full mb-6`}>
                  {step.icon}
                </div>
                <CardTitle className="text-xl font-bold">
                  {step.id}. {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed text-balance">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
