import type { TrendPoint } from "@/types/dashboard";

type TrendChartProps = {
  points: TrendPoint[];
  rangeLabel: string;
};

export function TrendChart({ points, rangeLabel }: TrendChartProps) {
  const width = 760;
  const height = 320;
  const padding = 28;
  const maxValue = Math.max(...points.map((point) => point.value));
  const minValue = Math.min(...points.map((point) => point.value));
  const ySpan = maxValue - minValue || 1;

  const coords = points.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
    const y =
      height - padding - ((point.value - minValue) / ySpan) * (height - padding * 2);

    return { ...point, x, y };
  });

  const linePath = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x} ${coord.y}`)
    .join(" ");

  return (
    <div className="trend-chart">
      <div className="trend-chart__legend">
        <span className="trend-chart__legend-dot" />
        <span>{rangeLabel} 기준 총 문의 수</span>
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

        <path d={linePath} className="trend-chart__path" />

        {coords.map((coord) => (
          <g key={coord.label}>
            <circle cx={coord.x} cy={coord.y} r="5" className="trend-chart__point" />
            <text x={coord.x} y={height - 8} textAnchor="middle" className="trend-chart__label">
              {coord.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
