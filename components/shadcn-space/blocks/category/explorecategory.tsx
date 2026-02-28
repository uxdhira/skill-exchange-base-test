"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CATEGORIES, mockSkills } from "@/data/mockData";

// 1. DATA: The 7 categories + "All"
// const CATEGORIES = ["All", "Cognitive", "Technical", "Interpersonal", "Personal", "Organizational", "Digital", "Language"];

// 2. SKILLS DATA: One example for every single category
// const SKILLS_DATA = [
//   { id: 1, title: "Critical Thinking", category: "Cognitive", desc: "Analyze facts to form a judgment." },
//   { id: 2, title: "Python Coding", category: "Technical", desc: "Build apps with modern code." },
//   { id: 3, title: "Active Listening", category: "Interpersonal", desc: "Understand and respond to others effectively." },
//   { id: 4, title: "Stress Management", category: "Personal", desc: "Maintain peak performance under pressure." },
//   { id: 5, title: "Project Strategy", category: "Organizational", desc: "Plan and track high-level business goals." },
//   { id: 6, title: "Cyber Security", category: "Digital", desc: "Protect data from digital threats." },
//   { id: 7, title: "Public Speaking", category: "Language", desc: "Speak confidently to any audience." },
// ];

export default function SkillCategories() {
  const [activeTab, setActiveTab] = useState("All");

  // Filter Logic
  const filteredSkills = activeTab === "All" 
    ? mockSkills 
    : mockSkills.filter((skill) => skill.category === activeTab);

  return (
    <section id="skill-categories" className="max-w-6xl mx-auto p-6 my-20">
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Popular Skill Categories</h2>

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
          <Card key={skill.id} className="border-none shadow-sm bg-slate-50 rounded-2xl overflow-hidden group">
            {/* Simple Visual Header */}
            <div className="h-32 bg-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest group-hover:bg-slate-300 transition-colors">
              {skill.category}
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{skill.title}</CardTitle>
              <p className="text-slate-500 text-sm leading-relaxed">{skill.description}</p>
            </CardHeader>

            <CardContent className="flex justify-between items-center pb-6">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter">
                {skill.category}
              </span>

              {/* Browse Button to Dashboard */}
              <Link href={`/skill/${skill.id}`}>
                <Button variant="outline" size="sm" className="rounded-full border-slate-700 hover:bg-black hover:text-white transition-all">
                  Browse <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State Logic */}
      {filteredSkills.length === 0 && (
        <p className="text-center text-slate-400 mt-10">No skills added in this category yet.</p>
      )}
    </div>
    
    </section>
  );
}