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
const RejectionReasonDialog = ({ isReasonOpen, setIsReasonOpen, booking }) => {
  return (
    <Dialog open={isReasonOpen} onOpenChange={setIsReasonOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejection Reason</DialogTitle>
          <DialogDescription>
            Current note attached to the rejected booking.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            {booking.providerMessage ||
              booking.requesterMessage ||
              "No rejection note was saved for this booking."}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsReasonOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionReasonDialog;
