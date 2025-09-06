import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DateScroller from "@/components/DateScroller";
import TimeGrid, { Booking } from "@/components/TimeGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format, startOfDay } from "date-fns";

const STORAGE_KEY = "futsal_bookings_v1";

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

function saveBookings(items: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [court, setCourt] = useState<number>(1);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  const dateKey = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);

  const onConfirm = () => {
    if (!name.trim() || !email.trim() || selectedHour === null) {
      toast.error("Fill name, email and select a time");
      return;
    }
    const conflict = bookings.some(
      (b) => b.date === dateKey && b.court === court && b.startHour === selectedHour,
    );
    if (conflict) {
      toast.error("That slot is already booked");
      return;
    }
    const id = `${dateKey}-${court}-${selectedHour}`;
    const next: Booking = { id, name: name.trim(), email: email.trim(), court, date: dateKey, startHour: selectedHour };
    setBookings((prev) => [...prev, next]);
    setSelectedHour(null);
    toast.success("Booked. Check your email for details.");
  };

  const todaysBookings = bookings.filter((b) => b.date === dateKey).sort((a,b)=>a.startHour-b.startHour);

  return (
    <div className="py-12">
      <section className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">book the pitch.</h1>
        <p className="text-sm text-muted-foreground max-w-prose">
          Real-world futsal bookings in 1-hour blocks. Minimal, fast, and to the point — inspired by geohot.com.
        </p>
        <div className="text-xs text-muted-foreground">Local time: {Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short" }).format(new Date())}</div>
      </section>

      <Separator className="my-8" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">choose date</h2>
          <div className="text-sm">{format(selectedDate, "EEEE, MMMM d, yyyy")}</div>
        </div>
        <DateScroller selected={selectedDate} onSelect={setSelectedDate} />
      </section>

      <Separator className="my-8" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">select time</h2>
          <div className="flex items-center gap-2 text-sm" role="tablist" aria-label="Choose court">
            {[1, 2, 3].map((c) => (
              <Button
                key={c}
                variant={court === c ? "default" : "outline"}
                size="sm"
                className="px-3 py-1 h-auto"
                onClick={() => setCourt(c)}
                role="tab"
                aria-selected={court === c}
                aria-label={`Court ${c}`}
              >
                court {c}
              </Button>
            ))}
          </div>
        </div>
        <TimeGrid
          date={selectedDate}
          court={court}
          selectedHour={selectedHour}
          onSelectHour={setSelectedHour}
          bookings={bookings}
          openHour={8}
          closeHour={22}
        />
      </section>

      <Separator className="my-8" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">your details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm" htmlFor="name">name</label>
            <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="your name" className="rounded-none" />
          </div>
          <div>
            <label className="text-sm" htmlFor="email">email</label>
            <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" className="rounded-none" />
          </div>
        </div>
        <Button onClick={onConfirm} className="w-full md:w-auto">confirm booking</Button>
      </section>

      <Separator className="my-8" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">bookings on {format(selectedDate, "MMM d")}</h2>
        {todaysBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <ul className="space-y-2">
            {todaysBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between border border-border p-3">
                <span className="tabular-nums">{String(b.startHour).padStart(2, "0")}:00 – {String(b.startHour + 1).padStart(2, "0")}:00</span>
                <span className="text-sm text-muted-foreground">court {b.court} • {b.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="rules" className="mt-16 space-y-2 text-sm text-muted-foreground">
        <h3 className="text-foreground">rules</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>1-hour blocks. Arrive 10 minutes early.</li>
          <li>Bring non-marking shoes. Respect the next slot.</li>
          <li>Cancel at least 2 hours before your slot.</li>
        </ul>
      </section>
    </div>
  );
}
