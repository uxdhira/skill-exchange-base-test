import type { Booking, Profile, Skill } from "@/types";

type StrapiEntity = Record<string, unknown> & {
  id?: number | string;
  documentId?: string;
};

function asEntity(value: unknown): StrapiEntity | null {
  if (!value || typeof value !== "object") return null;
  return value as StrapiEntity;
}

function asProfile(value: unknown): Profile | null {
  const entity = asEntity(value);
  if (!entity) return null;

  return {
    id: String(entity.id ?? entity.documentId ?? ""),
    documentId:
      typeof entity.documentId === "string" ? entity.documentId : undefined,
    firstName:
      typeof entity.firstName === "string" ? entity.firstName : undefined,
    lastName: typeof entity.lastName === "string" ? entity.lastName : undefined,
    bio: typeof entity.bio === "string" ? entity.bio : null,
    location: typeof entity.location === "string" ? entity.location : null,
    avatar: asEntity(entity.avatar)
      ? { url: String(asEntity(entity.avatar)?.url ?? "") }
      : null,
  };
}

function asSkill(value: unknown): Skill | null {
  const entity = asEntity(value);
  if (!entity) return null;

  const owner = asProfile(entity.owner);
  const category = asEntity(entity.category);

  return {
    id: String(entity.id ?? entity.documentId ?? ""),
    documentId:
      typeof entity.documentId === "string" ? entity.documentId : undefined,
    title: typeof entity.title === "string" ? entity.title : "",
    description:
      typeof entity.description === "string" ? entity.description : "",
    category:
      typeof entity.category === "string"
        ? entity.category
        : category && typeof category.name === "string"
          ? { name: category.name }
          : "Skill",
    location: typeof entity.location === "string" ? entity.location : "",
    skillLevel: typeof entity.skillLevel === "string" ? entity.skillLevel : "",
    userId: owner?.documentId || owner?.id || "",
    userName:
      [owner?.firstName, owner?.lastName].filter(Boolean).join(" ").trim() ||
      "",
    userRating: 0,
    owner: owner
      ? {
          documentId: owner.documentId,
          firstName: owner.firstName,
          lastName: owner.lastName,
          location: owner.location,
          avatar: owner.avatar,
        }
      : undefined,
    availability:
      typeof entity.availability === "string" ? entity.availability : undefined,
    mode:
      entity.mode === "inperson"
        ? "inperson"
        : entity.mode === "in_person"
          ? "in_person"
          : entity.mode === "hybrid"
            ? "hybrid"
            : "online",
    duration:
      typeof entity.duration === "string"
        ? entity.duration
        : typeof entity.durationMinutes === "number"
          ? `${entity.durationMinutes} minutes`
          : "",
    status:
      entity.status === "pending" ||
      entity.status === "rejected" ||
      entity.status === "completed"
        ? entity.status
        : "accepted",
    createdAt:
      typeof entity.createdAt === "string"
        ? entity.createdAt
        : new Date().toISOString(),
    image: asEntity(entity.image)
      ? { url: String(asEntity(entity.image)?.url ?? "") }
      : undefined,
  };
}

export function normalizeBooking(raw: unknown): Booking {
  const entity = asEntity(raw) || {};
  const requestedSkill = asSkill(entity.requestedSkill);
  const providedSkill = asSkill(entity.providedSkill);
  const provider = asProfile(entity.provider);
  const requester = asProfile(entity.requester);

  const providerName =
    [provider?.firstName, provider?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Provider";
  const requesterName =
    [requester?.firstName, requester?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Requester";

  const scheduledAt =
    typeof entity.scheduledAt === "string" ? entity.scheduledAt : null;

  return {
    id: String(entity.documentId ?? entity.id ?? ""),
    documentId:
      typeof entity.documentId === "string" ? entity.documentId : undefined,
    skillId: requestedSkill?.id || "",
    skillTitle: requestedSkill?.title || "Requested Skill",
    offeredSkillId: providedSkill?.id || "",
    offeredSkillTitle: providedSkill?.title || "Provided Skill",
    requestedSkillDocumentId: requestedSkill?.documentId,
    providedSkillDocumentId: providedSkill?.documentId,
    requesterId: requester?.documentId || requester?.id || "",
    requesterName,
    providerId: provider?.documentId || provider?.id || "",
    providerName,
    message:
      (typeof entity.requesterMessage === "string" &&
        entity.requesterMessage) ||
      (typeof entity.providerMessage === "string" && entity.providerMessage) ||
      "",
    bookingStatus:
      entity.bookingStatus === "pending" ||
      entity.bookingStatus === "accepted" ||
      entity.bookingStatus === "rejected" ||
      entity.bookingStatus === "completed" ||
      entity.bookingStatus === "cancelled"
        ? entity.bookingStatus
        : "pending",
    createdAt:
      typeof entity.createdAt === "string"
        ? entity.createdAt
        : new Date().toISOString(),
    date: scheduledAt ? scheduledAt.split("T")[0] : undefined,
    time: scheduledAt
      ? new Date(scheduledAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : undefined,
    location: typeof entity.location === "string" ? entity.location : undefined,
    mode:
      entity.mode === "online" ||
      entity.mode === "hybrid" ||
      entity.mode === "inperson"
        ? entity.mode
        : requestedSkill?.mode,
    durationMinutes:
      typeof entity.durationMinutes === "number"
        ? entity.durationMinutes
        : null,
    scheduledAt,
    providerMessage:
      typeof entity.providerMessage === "string"
        ? entity.providerMessage
        : null,
    requesterMessage:
      typeof entity.requesterMessage === "string"
        ? entity.requesterMessage
        : null,
    requestedSkill,
    providedSkill,
    provider,
    requester,
  };
}
