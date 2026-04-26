import { StrapiImage } from "@/types/general";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";

function ParticipantCard({
  title,
  role,
  name,
  skillTitle,
  profileImage,
}: {
  title: string;
  role: "Provider" | "Requester";
  name: string;
  skillTitle: string;
  profileImage: StrapiImage;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 ring-1 ring-slate-200">
          <AvatarImage src={profileImage?.url} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="font-medium text-slate-900">{name}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
          <p className="mt-1 font-medium text-slate-900">{role}</p>
        </div>
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Skill
          </p>
          <p className="mt-1 font-medium text-slate-900">{skillTitle}</p>
        </div>
      </div>
    </div>
  );
}
export default ParticipantCard;
