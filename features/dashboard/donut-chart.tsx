import type { KnowledgeResponseData } from "@/types/dashboard";

type DonutChartProps = {
  data: KnowledgeResponseData;
};

export function DonutChart({ data }: DonutChartProps) {
  const total = data.knowledge + data.general;
  const knowledgeAngle = (data.knowledge / total) * 360;

  return (
    <section className="panel panel--side">
      <div className="panel__header panel__header--compact">
        <h2 className="panel__title">지식 응답 비중</h2>
        <span className="panel__range-label">합계 100%</span>
      </div>

      <div className="donut">
        <div
          className="donut__chart"
          style={{
            background: `conic-gradient(var(--accent-green) 0deg ${knowledgeAngle}deg, var(--accent-rose) ${knowledgeAngle}deg 360deg)`
          }}
        >
          <div className="donut__hole">
            <span className="donut__hole-label">전체</span>
            <strong>{total}%</strong>
          </div>
        </div>

        <div className="donut__legend">
          <div className="donut__legend-item">
            <span className="donut__swatch donut__swatch--green" />
            <span>지식 기반 응답</span>
            <strong>{data.knowledge}%</strong>
          </div>
          <div className="donut__legend-item">
            <span className="donut__swatch donut__swatch--rose" />
            <span>일반 응답</span>
            <strong>{data.general}%</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
