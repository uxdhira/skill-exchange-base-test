import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  firstName?: string;
  lastName?: string;
  avatar?: any; // Strapi image
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-base",
};

function getInitials(first?: string, last?: string) {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "U";
}

function getImageUrl(img?: any) {
  return img?.url || "";
}

export function UserAvatar({
  firstName,
  lastName,
  avatar,
  size = "md",
}: Props) {
  const url = getImageUrl(avatar);

  return (
    <Avatar className={sizes[size]}>
      <AvatarImage src={url} />
      <AvatarFallback className="bg-slate-200">
        {getInitials(firstName, lastName)}
      </AvatarFallback>
    </Avatar>
  );
}
