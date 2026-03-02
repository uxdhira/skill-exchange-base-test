"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@/data/mockData";
import { Plus, MapPin, Star, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import SkillCard from "@/components/ui/skill-card";
import { useGlobalState } from "@/hooks/useGlobalState";

export default function MySkills() {
  const { mockSkillData } = useGlobalState();

  const mySkills = mockSkillData.filter(
    (skill) => skill.userId === currentUser.id,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Skills</h1>
          <p className="text-gray-600 mt-1">
            Manage the skills you are offering to the community
          </p>
        </div>
        <Link href="/dashboard/submit-skill">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Skill
          </Button>
        </Link>
      </div>

      {mySkills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No skills added yet</h3>
            <p className="text-gray-600 mb-4">
              Start sharing your expertise with the community
            </p>
            <Link href="/dashboard/submit-skill">
              <Button>Add Your First Skill</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mySkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              isEditEnabled={true}
              directUrl={`/dashboard/skill-details/${skill.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
