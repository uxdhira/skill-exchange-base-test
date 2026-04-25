import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/auth";
import { MapPin, Star } from "lucide-react";

/**
 * UserProfileBox shows a quick summary of the logged-in user inside the sidebar.
 */
const UserProfileBox = () => {
  const { data: user } = useCurrentUser();
  return (
    <div className="flex flex-col items-center text-center space-y-2   ">
      <Avatar className="w-22 h-22 ">
        <AvatarImage
          src={user?.profile?.avatar?.url}
          className="object-cover"
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      {user ? (
        <>
          <div>
            <h2 className="font-semibold text-base">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </h2>
            <div className="flex items-center justify-center text-sm text-muted-foreground gap-1">
              <MapPin className="w-3 h-3" />
              {user?.profile?.location}
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            {/* <span className="font-medium">{user?.profile.rating}</span> */}
            <span className="text-muted-foreground">
              Reviews / {user?.profile?.totalReviews || 0}
            </span>
          </div>
        </>
      ) : (
        <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
      )}
    </div>
  );
};

export default UserProfileBox;
