import type { TrendPoint } from "@/types/dashboard";

type TrendChartProps = {
  points: TrendPoint[];
  rangeLabel: string;
};

export function TrendChart({ points, rangeLabel }: TrendChartProps) {
  const width = 760;
  const height = 340;
  const padding = 32;

  const visitorMax = Math.max(...points.map((point) => point.visitors));
  const inquiryMax = Math.max(...points.map((point) => point.inquiries));
  const maxValue = Math.max(visitorMax, inquiryMax);
  const ySpan = maxValue || 1;

  const coords = points.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
    const visitorY = height - padding - (point.visitors / ySpan) * (height - padding * 2);
    const inquiryY = height - padding - (point.inquiries / ySpan) * (height - padding * 2);

    return { ...point, x, visitorY, inquiryY };
  });

  const linePath = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x} ${coord.inquiryY}`)
    .join(" ");

  return (
    <div className="trend-chart">
      <div className="trend-chart__legend">
        <span className="trend-chart__legend-item">
          <span className="trend-chart__legend-dot trend-chart__legend-dot--bar" />
          <span>접속자 수</span>
        </span>
        <span className="trend-chart__legend-item">
          <span className="trend-chart__legend-dot" />
          <span>답변 수</span>
        </span>
        <span className="trend-chart__legend-label">{rangeLabel} 기준</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart__svg" role="img">
        {[0, 1, 2, 3, 4].map((index) => {
          const y = padding + (index * (height - padding * 2)) / 4;

          return (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              className="trend-chart__grid"
            />
          );
        })}

        {coords.map((coord) => (
          <rect
            key={`${coord.label}-bar`}
            x={coord.x - 12}
            y={coord.visitorY}
            width="24"
            height={height - padding - coord.visitorY}
            rx="10"
            className="trend-chart__bar"
          />
        ))}

        <path d={linePath} className="trend-chart__path" />

        {coords.map((coord) => (
          <g key={coord.label}>
            <circle cx={coord.x} cy={coord.inquiryY} r="5" className="trend-chart__point" />
            <text x={coord.x} y={height - 8} textAnchor="middle" className="trend-chart__label">
              {coord.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
