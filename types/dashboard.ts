export type TimeRange = "DAY" | "WEEK" | "MONTH";

export type ComparisonDirection = "UP" | "DOWN";

export type MetricCardData = {
  key: "visitors" | "inquiries" | "failures";
  label: string;
  value: number;
  policyText: string;
  compareLabel: string;
  compareRate: number;
  compareDirection: ComparisonDirection;
};

export type TrendPoint = {
  label: string;
  visitors: number;
  inquiries: number;
};

export type KeywordItem = {
  rank: number;
  label: string;
  count: number;
};

export type FeedbackRatioData = {
  positive: number;
  negative: number;
};

export type DashboardPayload = {
  selectedRange: TimeRange;
  metrics: MetricCardData[];
  trend: TrendPoint[];
  fixedKeywords: KeywordItem[];
  fixedFeedbackRatio: FeedbackRatioData;
};
