interface DataPoint {
  date: Date | string;
  amount: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

const LineChart = ({ data, width = 600, height = 200 }: LineChartProps) => {
  if (data.length === 0) return null;

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find min and max values
  const maxAmount = Math.max(...data.map((d) => d.amount));
  const minDate = Math.min(...data.map((d) => new Date(d.date).getTime()));
  const maxDate = Math.max(...data.map((d) => new Date(d.date).getTime()));

  // Create points
  const points = data.map((d) => {
    const x =
      padding +
      ((new Date(d.date).getTime() - minDate) / (maxDate - minDate)) * chartWidth;
    const y = height - (padding + (d.amount / maxAmount) * chartHeight);
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Y-axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="currentColor"
        strokeOpacity={0.2}
      />
      {/* X-axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="currentColor"
        strokeOpacity={0.2}
      />

      {/* Line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
      />

      {/* Points */}
      {data.map((d, i) => {
        const x =
          padding +
          ((new Date(d.date).getTime() - minDate) / (maxDate - minDate)) * chartWidth;
        const y = height - (padding + (d.amount / maxAmount) * chartHeight);

        return (
          <g key={i} className="group">
            <circle
              cx={x}
              cy={y}
              r="4"
              className="fill-blue-500 transition-all group-hover:r-6"
            />
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity fill-current"
            >
              ${d.amount}
            </text>
          </g>
        );
      })}

      {/* Y-axis labels */}
      <text
        x={padding - 10}
        y={padding}
        textAnchor="end"
        className="text-xs fill-current"
      >
        ${maxAmount}
      </text>
      <text
        x={padding - 10}
        y={height - padding}
        textAnchor="end"
        className="text-xs fill-current"
      >
        $0
      </text>

      {/* X-axis labels */}
      <text
        x={padding}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-xs fill-current"
      >
        {new Date(minDate).toLocaleDateString()}
      </text>
      <text
        x={width - padding}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-xs fill-current"
      >
        {new Date(maxDate).toLocaleDateString()}
      </text>
    </svg>
  );
};

export default LineChart;
