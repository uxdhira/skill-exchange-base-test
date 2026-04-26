// Time
// Convert "14:30" to "2:30 PM"
export function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}
// Date and Time
type FormatMode = "short" | "long";
// Convert "2024-08-15T14:30:00Z" to "Aug 15, 2024, 2:30 PM"
export function formatDateTime(
  value?: string | null,
  mode: FormatMode = "short",
) {
  if (!value) return "To be confirmed";

  const baseOptions: Intl.DateTimeFormatOptions = {
    month: mode === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  const longExtra: Intl.DateTimeFormatOptions =
    mode === "long" ? { weekday: "long" } : {};

  return new Date(value).toLocaleString("en-US", {
    ...baseOptions,
    ...longExtra,
  });
}
// Date only
export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// Rating
export function getRatingStats(reviews: { rating: number }[]) {
  if (!reviews || reviews.length === 0) {
    return { average: 0, total: 0 };
  }

  const totalReviews = reviews.length;

  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);

  return {
    average: Number((sum / totalReviews).toFixed(1)), // 4.7 style
    total: totalReviews,
  };
}

//Booking
// get booking and skill mode
export function formatMode(mode?: string | null) {
  if (mode === "inperson" || mode === "in_person") return "In person";
  if (mode === "hybrid") return "Hybrid";
  if (mode === "online") return "Online";
  return "To be confirmed";
}
// get booking status
export function formatStatus(status) {
  if (status === "completed" || status === "complete") return "Completed";
  if (status === "cancelled") return "Cancelled";
  if (status === "pending") return "Pending";
  if (status === "accepted") return "Accepted";
  if (status === "rejected") return "Rejected";

  return status;
}
// Booking status badge classes
export function getStatusClasses(status: Booking["bookingStatus"]) {
  switch (status) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    case "completed":
    case "complete":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
    case "cancelled":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}
// format booking date and time
export function formatDuration(minutes?: number | null) {
  if (!minutes) return "Duration not set";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!remainingMinutes) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
}
// normalize mode for booking form
export function normalizeMode(mode?: string | null) {
  if (mode === "in_person") return "inperson";
  return mode === "online" || mode === "hybrid" || mode === "inperson"
    ? mode
    : "online";
}

// SKill
// get skill owner documentId safely
export function getSkillOwnerDocumentId(skill) {
  return skill?.owner?.documentId || "";
}

// Reviews
// Get reviewer name from review object, fallback to "Anonymous"
export function getReviewerName(review: any) {
  const from = review.fromUser;
  if (!from) return "Anonymous";
  return (
    [from.firstName, from.lastName].filter(Boolean).join(" ").trim() ||
    "Anonymous"
  );
}
