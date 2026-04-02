import type { TimeRange } from "@/types/dashboard";

export const dashboardRangeLabels: Record<
  TimeRange,
  { label: string; helper: string; axisLabel: string }
> = {
  DAY: {
    label: "오늘",
    helper: "오늘 기준",
    axisLabel: "시간"
  },
  WEEK: {
    label: "7일",
    helper: "지난 7일",
    axisLabel: "일"
  },
  MONTH: {
    label: "30일",
    helper: "지난 30일",
    axisLabel: "주"
  }
};
