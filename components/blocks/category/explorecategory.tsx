"use client";

import SkillCard from "@/components/ui/skill-card";
import { useCurrentUser } from "@/hooks/auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Category {
  name: string;
  slug: string;
}

interface SkillData {
  id: number;
  attributes?: {
    title: string;
    description: string;
    category: string | { name: string };
    [key: string]: unknown;
  };
  title?: string;
  description?: string;
  category?: string | { name: string };
  [key: string]: unknown;
}

function flattenSkill(skill: SkillData) {
  if (skill.attributes) {
    return { ...skill.attributes, id: skill.id };
  }
  return skill;
}

export default function SkillCategories({
  skillsData,
  categories = [],
}: {
  skillsData: SkillData[];
  categories?: Category[];
}) {
  const [activeTab, setActiveTab] = useState("All");
  const { data } = useCurrentUser();

  const flatSkills = skillsData.map(flattenSkill);
  console.log({ data });
  const filteredSkills =
    activeTab === "All"
      ? flatSkills
      : flatSkills.filter((skill) => {
          const skillCat = skill.category;
          return typeof skillCat === "string"
            ? skillCat === activeTab
            : skillCat?.name === activeTab;
        });

  return (
    <section id="skill-categories" className="max-w-6xl mx-auto p-6 my-20">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Popular Skill Categories
        </h2>
        <div className="text-center mb-8">
          <Link
            href="/browse"
            className="text-purple-600 hover:text-purple-700 font-semibold flex justify-end gap-2"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(cat.name)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === cat.name
                  ? "bg-black text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* SKILLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <SkillCard skill={skill} directUrl={`/skill/${skill.id}`} />
            </div>
          ))}
        </div>

        {/* Empty State Logic */}
        {filteredSkills.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            No skills added in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
