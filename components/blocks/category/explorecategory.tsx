"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CATEGORIES, mockSkills } from "@/data/mockData";
import Image from "next/image";
import SkillCard from "@/components/ui/skill-card";

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
            <SkillCard
              key={skill.id}
              skill={skill}
              directUrl={`/skill/${skill.id}`}
            />
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
