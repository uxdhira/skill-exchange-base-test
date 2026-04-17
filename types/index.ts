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

// This describes one skill listed by a user.
export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  skillLevel: string;
  userId: string;
  userName: string;
  userRating: number;
  image?: string;
  availability?: string;
  mode: "online" | "in_person" | "hybrid";
  duration: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

// This describes a booking request between two users.
export interface Booking {
  id: string;
  skillId: string;
  skillTitle: string;
  offeredSkillId: string;
  offeredSkillTitle: string;
  requesterId: string;
  requesterName: string;
  providerId: string;
  providerName: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "complete";
  createdAt: string;
  date?: string;
  time?: string;
  location?: string;
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
  mode?: "online" | "in_person" | "hybrid";
}
