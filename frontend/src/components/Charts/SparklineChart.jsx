import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function SparklineChart({ data = [] }) {

  // Convert simple array → Recharts format
  const formatted = data.map((value, index) => ({
    x: index,
    y: value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formatted}>
        <Tooltip cursor={false} contentStyle={{ display: "none" }} />

        <Line
          type="monotone"
          dataKey="y"
          stroke="#4e54c8"
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SparklineChart;
