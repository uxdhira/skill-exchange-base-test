// A simple type for brand items used in UI sections.
export type brandListType = {
  icon: React.ReactNode;
  name: string;
};

// This describes a user in the skill exchange app.
export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
}

export interface Profile {
  id: string;
  documentId?: string;
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  location?: string | null;
  avatar?:
    | string
    | {
        url?: string;
      }
    | null;
  rating?: number | null;
  totalReviews?: number | null;
  exchangeCompleted?: number | null;
  skillsOffered?: number | null;
  pauseProfile?: boolean | null;
  availability?: AvailabilitySlot[] | null;
  privacy?: Record<string, unknown> | null;
  notifications?: Record<string, unknown> | null;
}

export interface AvailabilitySlot {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// This describes one skill listed by a user.
export interface Skill {
  id: string;
  documentId?: string;
  title: string;
  description: string;
  category: string | { name: string; [key: string]: unknown };
  location: string;
  skillLevel: string;
  userId: string;
  userName: string;
  userRating: number;
  image?: { url: string } | string;
  owner?: {
    documentId?: string;
    firstName?: string;
    lastName?: string;
    location?: string | null;
    totalReviews?: number | null;
    avatar?:
      | string
      | {
          url?: string;
        }
      | null;
    user?: {
      username?: string;
    };
  };
  availability?: string;
  mode: "online" | "in_person" | "inperson" | "hybrid";
  duration: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

// This describes a booking request between two users.
export interface Booking {
  id: string;
  documentId?: string;
  skillId: string;
  skillTitle: string;
  offeredSkillId: string;
  offeredSkillTitle: string;
  requesterId: string;
  requesterName: string;
  providerId: string;
  providerName: string;
  message: string;
  bookingStatus:
    | "pending"
    | "accepted"
    | "rejected"
    | "complete"
    | "completed"
    | "cancelled";
  createdAt: string;
  date?: string;
  time?: string;
  location?: string;
  requestedSkillDocumentId?: string;
  providedSkillDocumentId?: string;
  mode?: "online" | "in_person" | "inperson" | "hybrid";
  durationMinutes?: number | null;
  scheduledAt?: string | null;
  providerMessage?: string | null;
  requesterMessage?: string | null;
  requestedSkill?: Skill | null;
  providedSkill?: Skill | null;
  provider?: Profile | null;
  requester?: Profile | null;
}

// This describes a review left after a skill session.
export interface Review {
  id: string;
  skillId: string;
  skillTitle: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// This describes a skill request from a user.
export interface RequestedSkill {
  id: string;
  title: string;
  category: string;
  description: string;
  preferredSchedule: string;
  preferredDate?: string;
  preferredTime?: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  status: "active" | "matched" | "closed";
  matchCount: number;
  userId: string;
  userName: string;
  createdAt: string;
  duration?: string;
  mode?: "online" | "in_person" | "inperson" | "hybrid";
}
