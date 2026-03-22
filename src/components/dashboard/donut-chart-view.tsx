"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import type { DonutChartViewProps } from "./types";

export function DonutChartView({ data, centerLabel, centerValue, height = 280 }: DonutChartViewProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        {(centerLabel || centerValue) && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
            {centerValue && (
              <tspan x="50%" dy="-0.3em" className="text-lg font-bold" fill="var(--foreground)">
                {centerValue}
              </tspan>
            )}
            {centerLabel && (
              <tspan x="50%" dy="1.4em" className="text-xs" fill="var(--muted-foreground)">
                {centerLabel}
              </tspan>
            )}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
