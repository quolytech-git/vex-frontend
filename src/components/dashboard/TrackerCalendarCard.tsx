"use client";

import React from "react";

export interface CalendarEventMarker {
  dateKey: string; // YYYY-MM-DD
  kind: "session" | "interview" | "deadline";
}

interface TrackerCalendarCardProps {
  viewYear: number;
  viewMonth: number; // 0-indexed (10 = November)
  selectedDateKey: string;
  todayDateKey: string;
  markers: CalendarEventMarker[];
  onSelectDate: (dateKey: string) => void;
  onChangeMonth: (delta: number) => void;
  onJumpToday: () => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDateKey(year: number, month0: number, day: number): string {
  const m = String(month0 + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function formatHumanDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return dateKey;
  const monthName = MONTH_NAMES[(m - 1) % 12] ?? "";
  return `${monthName.slice(0, 3)} ${String(d).padStart(2, "0")}, ${y}`;
}

export default function TrackerCalendarCard({
  viewYear,
  viewMonth,
  selectedDateKey,
  todayDateKey,
  markers,
  onSelectDate,
  onChangeMonth,
  onJumpToday,
}: TrackerCalendarCardProps) {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  // Convert Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const markersByDate = new Map<string, CalendarEventMarker["kind"][]>();
  for (const m of markers) {
    const existing = markersByDate.get(m.dateKey) ?? [];
    if (!existing.includes(m.kind)) {
      markersByDate.set(m.dateKey, [...existing, m.kind]);
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-[24px] border border-[#dcd2bd] bg-[#fffef9] p-5">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6b4e]">
              Hellenic Chronology · Interactive Calendar
            </p>
            <h3 className="mt-0.5 font-serif-display text-[20px] text-[#212d3d]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onChangeMonth(-1)}
              aria-label="Previous month"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#dfd3ba] bg-[#faf6ed] text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={onJumpToday}
              className="cursor-pointer rounded-full border border-[#dfd3ba] bg-[#faf6ed] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#212d3d] hover:border-[#212d3d]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onChangeMonth(1)}
              aria-label="Next month"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#dfd3ba] bg-[#faf6ed] text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 border-b border-[#efe7d3] pb-1.5 text-center font-mono text-[9.5px] font-semibold uppercase text-[#7a6b4e]">
          {WEEKDAYS.map((wd) => (
            <span key={wd}>{wd}</span>
          ))}
        </div>

        {/* Interactive Day Grid */}
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-9" />;
            }
            const dateKey = formatDateKey(viewYear, viewMonth, day);
            const isSelected = dateKey === selectedDateKey;
            const isToday = dateKey === todayDateKey;
            const kinds = markersByDate.get(dateKey) ?? [];

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onSelectDate(dateKey)}
                className={`relative flex h-9 cursor-pointer flex-col items-center justify-center rounded-[10px] border font-mono text-[11.5px] transition-all ${
                  isSelected
                    ? "border-[#212d3d] bg-[#212d3d] font-semibold text-[#faf6ed] shadow-sm"
                    : isToday
                    ? "border-[#8f7d5d] bg-[#f4ede0] font-semibold text-[#212d3d]"
                    : "border-transparent bg-transparent text-[#212d3d] hover:border-[#dcd2bd] hover:bg-[#faf6ed]"
                }`}
              >
                <span>{day}</span>
                {kinds.length > 0 && (
                  <span className="mt-0.5 flex items-center gap-0.5">
                    {kinds.includes("interview") && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-[#a6f4c5]" : "bg-[#477c5b]"
                        }`}
                      />
                    )}
                    {kinds.includes("session") && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-[#d4af63]" : "bg-[#b88b32]"
                        }`}
                      />
                    )}
                    {kinds.includes("deadline") && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-[#d3aee0]" : "bg-[#8d5ea2]"
                        }`}
                      />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#efe7d3] pt-2.5 text-[10.5px] text-[#5c5344]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#477c5b]" />
            Interview
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#b88b32]" />
            Session
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#8d5ea2]" />
            Deadline
          </span>
        </div>
        <span className="font-mono text-[10px] font-semibold text-[#212d3d]">
          {formatHumanDate(selectedDateKey)}
        </span>
      </div>
    </div>
  );
}

