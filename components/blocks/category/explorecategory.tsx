"use client";

import SkillCard from "@/components/ui/skill-card";
import { CATEGORIES, mockSkills } from "@/data/mockData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SkillCategories() {
  const [activeTab, setActiveTab] = useState("All");

  // Filter Logic
  const filteredSkills =
    activeTab === "All"
      ? mockSkills
      : mockSkills.filter((skill) => skill.category === activeTab);

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
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === cat
                  ? "bg-black text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
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
