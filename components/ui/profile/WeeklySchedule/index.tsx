import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAYS, formatTime } from "@/lib/utility";
import type { AvailabilitySlot } from "@/types";

type Slot = AvailabilitySlot;

function WeeklySchedule({ data }: { data: Slot[] }) {
  const map = new Map<number, Slot>();

  data.forEach((item) => {
    map.set(item.dayOfWeek, item);
  });

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Weekly Availability</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {DAYS.map((day, index) => {
          const slot = map.get(index);

          return (
            <div
              key={day}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="font-medium">{day}</span>

              {slot ? (
                <span className="text-sm text-muted-foreground">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground italic">
                  Unavailable
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
export default WeeklySchedule;
