import { addDays, format, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";

export interface DateScrollerProps {
  days?: number;
  selected: Date;
  onSelect: (d: Date) => void;
}

export default function DateScroller({ days = 14, selected, onSelect }: DateScrollerProps) {
  const today = startOfDay(new Date());
  const items = Array.from({ length: days }, (_, i) => addDays(today, i));

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2" role="tablist" aria-label="Choose date">
      {items.map((d) => {
        const isSelected = startOfDay(d).getTime() === startOfDay(selected).getTime();
        return (
          <Button
            key={d.toISOString()}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="shrink-0 px-3 py-1 h-auto"
            onClick={() => onSelect(d)}
            role="tab"
            aria-selected={isSelected}
          >
            <span className="mr-2 opacity-70">{format(d, "EEE")}</span>
            <span>{format(d, "MMM d")}</span>
          </Button>
        );
      })}
    </div>
  );
}
