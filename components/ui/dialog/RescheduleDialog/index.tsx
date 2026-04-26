"use client";

import { Button } from "@/components/ui/button";
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
const RescheduleDialog = ({
  isRescheduleOpen,
  setIsRescheduleOpen,
  rescheduleData,
  setRescheduleData,
  handleReschedule,
}) => {
  return (
    <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Reschedule</DialogTitle>
          <DialogDescription>
            Propose a new date and time for this booking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleReschedule}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled-at">New schedule</Label>
              <Input
                id="scheduled-at"
                type="datetime-local"
                value={rescheduleData.scheduledAt}
                onChange={(e) =>
                  setRescheduleData({
                    ...rescheduleData,
                    scheduledAt: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Explain why you need to move the session."
                value={rescheduleData.reason}
                onChange={(e) =>
                  setRescheduleData({
                    ...rescheduleData,
                    reason: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRescheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Send request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
