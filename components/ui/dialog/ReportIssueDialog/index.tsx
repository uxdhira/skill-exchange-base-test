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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const ReportIssueDialog = ({
  isReportOpen,
  setIsReportOpen,
  reportReason,
  setReportReason,
  reportDetails,
  setReportDetails,
  handleReportSubmit,
}) => {
  return (
    <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Issue</DialogTitle>
          <DialogDescription>
            Help us understand what went wrong with this booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-reason">Reason</Label>
            <select
              id="report-reason"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="Harassment or inappropriate behavior">
                Harassment or inappropriate behavior
              </option>
              <option value="No-show or unreliability">
                No-show or unreliability
              </option>
              <option value="Inappropriate content">
                Inappropriate content
              </option>
              <option value="Suspicious activity or scam">
                Suspicious activity or scam
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-details">Additional details</Label>
            <Textarea
              id="report-details"
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Please describe what happened."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsReportOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReportSubmit}>
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueDialog;
