import type { MetricCardData } from "@/types/dashboard";

type MetricCardProps = {
  metric: MetricCardData;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-card__label">{metric.label}</div>
      <div className="metric-card__value">{metric.value.toLocaleString()}건</div>
      <div className="metric-card__policy">{metric.policyText}</div>
    </article>
  );
}
