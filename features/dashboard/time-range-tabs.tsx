"use client";

import type { TimeRange } from "@/types/dashboard";
import { dashboardRangeLabels } from "@/features/dashboard/range-config";

type TimeRangeTabsProps = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
};

const timeRanges: TimeRange[] = ["DAY", "WEEK", "MONTH"];

export function TimeRangeTabs({ value, onChange }: TimeRangeTabsProps) {
  return (
    <div className="time-range-tabs" role="tablist" aria-label="기간 선택">
      {timeRanges.map((range) => {
        const isSelected = range === value;

        return (
          <button
            key={range}
            type="button"
            className={`time-range-tabs__button${isSelected ? " is-selected" : ""}`}
            onClick={() => onChange(range)}
          >
            {dashboardRangeLabels[range].label}
          </button>
        );
      })}
    </div>
  );
}
