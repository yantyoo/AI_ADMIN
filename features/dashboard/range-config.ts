import type { TimeRange } from "@/types/dashboard";

export const dashboardRangeLabels: Record<
  TimeRange,
  { label: string; helper: string; axisLabel: string }
> = {
  DAY: {
    label: "일간",
    helper: "일간 기준",
    axisLabel: "시간"
  },
  WEEK: {
    label: "주간",
    helper: "주간 기준",
    axisLabel: "일"
  },
  MONTH: {
    label: "월간",
    helper: "월간 기준",
    axisLabel: "주"
  }
};
