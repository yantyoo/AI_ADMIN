export type TimeRange = "DAY" | "WEEK" | "MONTH";

export type MetricCardData = {
  key: "visitors" | "inquiries" | "failures";
  label: string;
  value: number;
  policyText: string;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type KnowledgeResponseData = {
  knowledge: number;
  general: number;
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
  knowledgeResponse: KnowledgeResponseData;
  topKeywords: KeywordItem[];
  feedbackRatio: FeedbackRatioData;
};
