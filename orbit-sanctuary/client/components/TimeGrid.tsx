import { format, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";

export type Booking = {
  id: string;
  name: string;
  email: string;
  court: number;
  date: string; // YYYY-MM-DD
  startHour: number; // 24h
};

export interface TimeGridProps {
  date: Date;
  court: number;
  selectedHour: number | null;
  onSelectHour: (h: number) => void;
  bookings: Booking[];
  openHour?: number; // inclusive
  closeHour?: number; // exclusive
}

export default function TimeGrid({
  date,
  court,
  selectedHour,
  onSelectHour,
  bookings,
  openHour = 8,
  closeHour = 22,
}: TimeGridProps) {
  const now = new Date();
  const isToday = isSameDay(now, date);
  const hours = Array.from({ length: closeHour - openHour }, (_, i) => openHour + i);

  const dateKey = format(date, "yyyy-MM-dd");
  const bookedSet = new Set(
    bookings
      .filter((b) => b.court === court && b.date === dateKey)
      .map((b) => b.startHour),
  );

  return (
    <div className="divide-y divide-border border border-border">
      {hours.map((h) => {
        const label = `${String(h).padStart(2, "0")}:00 – ${String(h + 1).padStart(2, "0")}:00`;
        const isPast = isToday && h <= now.getHours();
        const isBooked = bookedSet.has(h);
        const isSelected = selectedHour === h;
        const disabled = isPast || isBooked;
        return (
          <div key={h} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <span className="tabular-nums min-w-[140px]">{label}</span>
              {isBooked ? (
                <span className="text-xs uppercase tracking-wider text-muted-foreground">booked</span>
              ) : isPast ? (
                <span className="text-xs uppercase tracking-wider text-muted-foreground">past</span>
              ) : (
                <span className="text-xs uppercase tracking-wider text-foreground">available</span>
              )}
            </div>
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="px-3 py-1 h-auto"
              disabled={disabled}
              onClick={() => onSelectHour(h)}
            >
              {isSelected ? "selected" : "select"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
