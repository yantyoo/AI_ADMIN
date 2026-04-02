import type { FeedbackRatioData } from "@/types/dashboard";

type FeedbackRatioProps = {
  data: FeedbackRatioData;
};

export function FeedbackRatio({ data }: FeedbackRatioProps) {
  const total = data.positive + data.negative;
  const positiveAngle = (data.positive / total) * 360;

  return (
    <section className="panel panel--side">
      <div className="panel__header panel__header--compact">
        <h2 className="panel__title">피드백 비율</h2>
        <span className="panel__range-label">지난 7일</span>
      </div>

      <div className="donut">
        <div
          className="donut__chart"
          style={{
            background: `conic-gradient(var(--accent-green) 0deg ${positiveAngle}deg, var(--accent-rose) ${positiveAngle}deg 360deg)`
          }}
        >
          <div className="donut__hole">
            <span className="donut__hole-label">전체</span>
            <strong>{total}%</strong>
          </div>
        </div>

        <div className="feedback-toggle">
          <button type="button" className="feedback-toggle__button is-selected">
            만족해요
          </button>
          <button type="button" className="feedback-toggle__button">
            아쉬워요
          </button>
        </div>

        <div className="donut__legend">
          <div className="donut__legend-item">
            <span className="donut__swatch donut__swatch--green" />
            <span>만족해요</span>
            <strong>{data.positive}%</strong>
          </div>
          <div className="donut__legend-item">
            <span className="donut__swatch donut__swatch--rose" />
            <span>아쉬워요</span>
            <strong>{data.negative}%</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
