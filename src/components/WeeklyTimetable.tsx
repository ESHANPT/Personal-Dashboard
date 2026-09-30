import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStore } from "@/lib/local-store";

type Timetable = {
  days: string[];
  rows: { time: string; cells: string[] }[];
};

const defaultTimetable: Timetable = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  rows: [
    { time: "9:00–10:00", cells: ["", "", "", "", "", "", ""] },
    { time: "10:00–11:00", cells: ["", "", "", "", "", "", ""] },
    { time: "11:00–12:00", cells: ["", "", "", "", "", "", ""] },
    { time: "12:00–1:00", cells: ["", "", "", "", "", "", ""] },
    { time: "1:00–2:00", cells: ["", "", "", "", "", "", ""] },
    { time: "2:00–3:00", cells: ["", "", "", "", "", "", ""] },
    { time: "3:00–4:00", cells: ["", "", "", "", "", "", ""] },
  ],
};

const cellInput =
  "w-full min-w-28 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:bg-background/70 focus:ring-2 focus:ring-inset focus:ring-ring";

export function WeeklyTimetable() {
  const [timetable, setTimetable] = useLocalStore<Timetable>(
    "eshan.university.timetable",
    defaultTimetable,
  );
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const updateDay = (index: number, value: string) =>
    setTimetable((prev) => ({
      ...prev,
      days: prev.days.map((day, i) => (i === index ? value : day)),
    }));

  const updateTime = (rowIndex: number, value: string) =>
    setTimetable((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) => (i === rowIndex ? { ...row, time: value } : row)),
    }));

  const updateCell = (rowIndex: number, columnIndex: number, value: string) =>
    setTimetable((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) =>
        i === rowIndex
          ? { ...row, cells: row.cells.map((cell, j) => (j === columnIndex ? value : cell)) }
          : row,
      ),
    }));

  const reset = () => {
    if (window.confirm("Reset the weekly timetable? All timetable edits will be cleared.")) {
      setTimetable(defaultTimetable);
    }
  };

  return (
    <section className="card-leaf fade-up overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-forest">🗓 Weekly Timetable</h2>
        <Button type="button" variant="outline" size="sm" onClick={reset} className="text-forest">
          <RotateCcw className="size-3.5" /> Reset timetable
        </Button>
      </div>

      <div className="overflow-x-auto border-t border-border">
        <table className="w-full min-w-[1080px] table-fixed border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="w-36 border-r border-primary-foreground/20 p-0">
                <span className="block px-3 py-3 text-left text-sm font-semibold">Time</span>
              </th>
              {timetable.days.map((day, index) => (
                <th
                  key={index}
                  className={index === todayIndex ? "bg-secondary text-secondary-foreground" : ""}
                >
                  <input
                    value={day}
                    onChange={(event) => updateDay(index, event.target.value)}
                    aria-label={`Edit day ${index + 1}`}
                    className="w-full bg-transparent px-3 py-3 text-center text-sm font-semibold outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetable.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border">
                <th className="border-r border-border bg-muted/70 p-0">
                  <input
                    value={row.time}
                    onChange={(event) => updateTime(rowIndex, event.target.value)}
                    aria-label={`Edit time row ${rowIndex + 1}`}
                    className={`${cellInput} font-medium text-forest`}
                  />
                </th>
                {row.cells.map((cell, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={
                      columnIndex === todayIndex
                        ? "border-r border-border bg-secondary/70 p-0 last:border-r-0"
                        : "border-r border-border bg-background/60 p-0 last:border-r-0 even:bg-muted/40"
                    }
                  >
                    <input
                      value={cell}
                      onChange={(event) => updateCell(rowIndex, columnIndex, event.target.value)}
                      placeholder="Add class…"
                      aria-label={`${timetable.days[columnIndex] || `Day ${columnIndex + 1}`}, ${row.time}`}
                      className={cellInput}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}