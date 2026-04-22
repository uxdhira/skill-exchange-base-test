import { useGlobalState } from "@/hooks/GlobalState";
import { Skill } from "@/types";
import { Clock, Edit, MapPin, Monitor, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

// Props used by the reusable skill card.
const SkillCard = ({
  skill,
  isEditEnabled = false,
  directUrl,
}: {
  skill: Skill & Record<string, unknown>;
  isEditEnabled?: boolean;
  directUrl?: string;
}) => {
  const getCategoryName = () => {
    const cat = skill.category;
    return typeof cat === "string" ? cat : cat?.name || "Uncategorized";
  };

  return (
    <Card
      key={skill.id}
      className="hover:shadow-lg transition-shadow p-0 rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="flex-1">
        <CardHeader className="p-0">
          <div className="overflow-hidden h-50 bg-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest group-hover:bg-slate-300 transition-colors">
            {skill.image ? (
              typeof skill.image === "string" ? (
                <Image
                  src={skill.image}
                  alt={skill.title}
                  width={440}
                  height={300}
                  className="w-full h-full object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-125 transition duration-300 delay-75"
                  unoptimized
                />
              ) : (
                <Image
                  src={(skill.image as { url: string }).url}
                  alt={skill.title}
                  width={440}
                  height={300}
                  className="w-full h-full object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-125 transition duration-300 delay-75"
                  unoptimized
                />
              )
            ) : (
              getCategoryName()
            )}
          </div>
          <div className="flex items-start justify-between mb-2 px-4">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {getCategoryName()}
            </span>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {(skill.skillLevel as string) || "All Levels"}
            </span>
          </div>
          <CardTitle className="text-xl px-4">
            {(skill.title as string) || "Untitled Skill"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <div className="space-y-2 ">
            <p className="text-sm text-gray-600 line-clamp-3">
              {(skill.description as string) || "No description available"}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  by {(skill.userName as string) || "Unknown"}
                </span>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {(skill.userRating as number) || 0}
                  </span>
                </div>
              </div>

              <div className="flex justify-between gap-8 text-gray-600">
                <span className="flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  <span className="capitalize">
                    {((skill.mode as string) || "online").replace("_", " ")}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{(skill.duration as string) || "TBD"}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                {(skill.location as string) || "Online"}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
      <div className="flex px-4 pb-4 mt-auto items-center gap-2">
        {directUrl && (
          <Link href={directUrl} className="w-full">
            <Button className="w-full">View Details</Button>
          </Link>
        )}
        {isEditEnabled && <EditSkill skill={skill as Skill} />}
      </div>
    </Card>
  );
};

export default SkillCard;

/**
 * EditSkill shows edit and delete actions when the card is used on the user's own skills page.
 */
const EditSkill = ({ skill }: { skill: Skill }) => {
  const { deleteSkill } = useGlobalState();

  // Delete the skill from shared state and show a success message.
  function handleDelete(skillId: string) {
    deleteSkill(skillId);
    toast("This skill has been deleted.", { position: "top-center" });
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link href={`/dashboard/submit-skill?id=${skill.documentId}&edit=true`}>
          <Edit className="w-4 h-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(skill.id)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  );
};
