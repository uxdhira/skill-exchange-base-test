export type brandListType = {
  icon: React.ReactNode;
  name: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
}

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
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

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
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

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
