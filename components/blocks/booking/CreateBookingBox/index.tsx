"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ParticipantCard from "@/components/ui/card/ParticipantCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/auth";
import { useCreateBooking } from "@/hooks/bookings";
import { useOwnerSkills, useSkills } from "@/hooks/skill";
import { getSkillOwnerDocumentId, normalizeMode } from "@/lib/utility";

import SkillSearchCombobox from "../SkillSearchCombobox";

const CreateBookingDialogBox = ({ showCreateModal, setShowCreateModal }) => {
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const profileDocumentId = user?.profile?.documentId || "";

  const { data: ownerSkillsData, isLoading: ownerSkillsLoading } =
    useOwnerSkills(profileDocumentId);
  const { data: allSkillsData, isLoading: allSkillsLoading } = useSkills({
    page: 1,
    pageSize: 9,
    sort: "createdAt:desc",
  });
  const createBooking = useCreateBooking();
  console.log({ allSkillsData });
  // const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequestedSkillId, setSelectedRequestedSkillId] = useState("");
  const [selectedProvidedSkillId, setSelectedProvidedSkillId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<"online" | "inperson" | "hybrid">("online");
  const [requesterMessage, setRequesterMessage] = useState("");

  const ownerSkills = useMemo(
    () => ownerSkillsData?.data ?? [],
    [ownerSkillsData],
  );
  const allSkills = useMemo(() => allSkillsData?.data ?? [], [allSkillsData]);

  const availableRequestedSkills = useMemo(
    () =>
      allSkills.filter((skill) => {
        const ownerId = getSkillOwnerDocumentId(skill);
        const title = skill.title.toLowerCase();
        const matchesSearch = title.includes(searchTerm.trim().toLowerCase());
        const isOwnSkill = ownerId === profileDocumentId;
        return !isOwnSkill && (!!searchTerm.trim() ? matchesSearch : true);
      }),
    [allSkills, profileDocumentId, searchTerm],
  );

  const selectedRequestedSkill =
    allSkills.find((skill) => skill.documentId === selectedRequestedSkillId) ||
    null;
  const selectedProvidedSkill =
    ownerSkills.find((skill) => skill.documentId === selectedProvidedSkillId) ||
    null;

  const resetCreateForm = () => {
    setSearchTerm("");
    setSelectedRequestedSkillId("");
    setSelectedProvidedSkillId("");
    setScheduledAt("");
    setDurationMinutes("60");
    setLocation("");
    setMode("online");
    setRequesterMessage("");
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetCreateForm();
  };

  const handleCreateBooking = async () => {
    if (!profileDocumentId) {
      toast.error("Your profile is required before creating a booking.");
      return;
    }

    if (!selectedRequestedSkill || !selectedRequestedSkill.documentId) {
      toast.error("Please choose the skill you want to learn.");
      return;
    }

    if (!selectedProvidedSkill || !selectedProvidedSkill.documentId) {
      toast.error("Please choose your offered exchange skill.");
      return;
    }

    if (!scheduledAt) {
      toast.error("Please choose a date and time.");
      return;
    }

    const providerDocumentId = getSkillOwnerDocumentId(selectedRequestedSkill);
    if (!providerDocumentId) {
      toast.error("The selected requested skill is missing its provider.");
      return;
    }

    try {
      await createBooking.mutateAsync({
        requestedSkill: selectedRequestedSkill.documentId,
        providedSkill: selectedProvidedSkill.documentId,
        provider: providerDocumentId,
        requester: profileDocumentId,
        bookingStatus: "pending",
        mode,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        location,
        requesterMessage,
        providerMessage: "",
      });

      toast.success("Booking request created successfully.");
      closeCreateModal();
    } catch {
      toast.error("Failed to create booking.");
    }
  };
  return (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Skill Booking</DialogTitle>
          <DialogDescription>
            Search for the skill you want to learn, choose one of your offered
            skills in exchange, and schedule the session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="relative space-y-3">
            <Label htmlFor="skill-search">Search skill to learn</Label>

            <SkillSearchCombobox
              allSkills={allSkills}
              profileDocumentId={profileDocumentId}
              selectedRequestedSkillId={selectedRequestedSkillId}
              setSelectedRequestedSkillId={setSelectedRequestedSkillId}
              setMode={setMode}
              setLocation={setLocation}
              normalizeMode={normalizeMode}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="provided-skill">Your exchange skill</Label>
              <select
                id="provided-skill"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={selectedProvidedSkillId}
                onChange={(e) => setSelectedProvidedSkillId(e.target.value)}
                disabled={ownerSkillsLoading}
              >
                <option value="">Select your skill</option>
                {ownerSkills.map((skill) => (
                  <option
                    key={skill.documentId || skill.id}
                    value={skill.documentId || ""}
                  >
                    {skill.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Mode</Label>
              <select
                id="mode"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "online" | "inperson" | "hybrid")
                }
              >
                <option value="online">Online</option>
                <option value="inperson">In person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-at">Scheduled at</Label>
              <Input
                id="scheduled-at"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Zoom, Google Meet, or a physical address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="request-message">Message to provider</Label>
              <Textarea
                id="request-message"
                rows={4}
                placeholder="Tell them what you want to learn and what you’re offering in exchange."
                value={requesterMessage}
                onChange={(e) => setRequesterMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ParticipantCard
              title="You"
              role="Requester"
              name={
                [user?.profile?.firstName, user?.profile?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
                user?.username ||
                "You"
              }
              skillTitle={selectedProvidedSkill?.title || "Choose your skill"}
              profileImage={false}
            />
            <ParticipantCard
              title="Other Person"
              role="Provider"
              name={
                selectedRequestedSkill
                  ? [
                      selectedRequestedSkill.owner?.firstName,
                      selectedRequestedSkill.owner?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") || "Provider"
                  : "Select a skill first"
              }
              skillTitle={
                selectedRequestedSkill?.title || "Choose a requested skill"
              }
              profileImage={false}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateBooking}
            disabled={
              createBooking.isPending ||
              !selectedRequestedSkillId ||
              !selectedProvidedSkillId
            }
          >
            {createBooking.isPending ? "Creating..." : "Create booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingDialogBox;
