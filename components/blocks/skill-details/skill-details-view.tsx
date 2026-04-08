"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skill } from "@/types";
import { ArrowLeft, Calendar, Info, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

// Props needed to show a single skill details page.
interface SkillDetailsProps {
  skill: Skill;
  isOwner?: boolean;
  backUrl?: string;
}

/**
 * This component shows full details of one skill.
 * It is reused by the landing area and dashboard detail pages.
 */
export default function SkillDetailsView({
  skill,
  isOwner,
  backUrl,
}: SkillDetailsProps) {
  const router = useRouter();

  // Show a simple message if no skill was found.
  if (!skill) return <p className="p-6">Skill not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Button
        variant={"ghost"}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="p-0 overflow-hidden rounded-2xl">
        <div className="  h-60 bg-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest group-hover:bg-slate-300 transition-colors">
          {skill.image ? (
            <Image
              src={skill.image}
              alt="Serenity Residential Home"
              width={440}
              height={400}
              className="w-full h-full object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-125 transition duration-300 delay-75"
            />
          ) : (
            skill.category
          )}
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="flex gap-2">
            <Badge variant="secondary">{skill.category}</Badge>
            <Badge variant="secondary">{skill.skillLevel}</Badge>
          </div>

          <h1 className="text-3xl font-bold">{skill.title}</h1>

          <div className="flex gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {skill.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              {skill.userRating}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Weekday evenings
            </span>
          </div>

          <div>
            <h3 className="font-bold text-lg">Description</h3>
            <p className="text-slate-600">{skill.description}</p>
          </div>

          <hr />

          <div>
            <h3 className="font-bold text-lg">Offered By</h3>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{skill.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{skill.userName}</p>
                <p className="text-sm text-slate-500">{skill.location}</p>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
              <Info className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700">
                This is your skill listing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
