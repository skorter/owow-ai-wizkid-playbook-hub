"use client";

import { useState } from "react";
import type { PeakHourPoint } from "@/data/adminMockData";
import { plotX, plotY, smoothAreaPath, smoothLinePath } from "./chartUtils";
import styles from "./PeakHoursChart.module.css";
import ChartEmptyPlaceholder from "./ChartEmptyPlaceholder";
import { Clock } from "lucide-react";

const WIDTH = 420;
const HEIGHT = 168;
const PADDING = { top: 10, right: 12, bottom: 32, left: 36 };
const LINE_COLOR = "#22c55e";

type PeakHoursChartProps = {
  data: PeakHourPoint[];
  yMax: number;
  yTicks: number[];
  emptyMessage?: string;
};

export default function PeakHoursChart({
  data,
  yMax,
  yTicks,
  emptyMessage = "No search activity recorded yet.",
}: PeakHoursChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const safeYMax = yMax > 0 ? yMax : 10;
  const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
  const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;
  const BASELINE_Y = PADDING.top + PLOT_HEIGHT;
  const COUNT = data.length;

  const hasActivity = data.some((point) => point.value > 0);

  if (COUNT === 0 || !hasActivity) {
    return (
      <ChartEmptyPlaceholder
        icon={Clock}
        title="Peak hours not available yet"
        description={
          emptyMessage ||
          "Search activity by hour will appear after employees start using playbook search."
        }
      />
    );
  }

  const linePoints = data.map((point, index) => ({
    x: plotX(index, COUNT, PADDING.left, PLOT_WIDTH),
    y: plotY(point.value, safeYMax, PADDING.top, PLOT_HEIGHT),
  }));

  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoverX =
    hoveredIndex !== null ? plotX(hoveredIndex, COUNT, PADDING.left, PLOT_WIDTH) : 0;
  const bandWidth = PLOT_WIDTH / COUNT;

  const tooltipLeft = (hoverX / WIDTH) * 100;
  const tooltipTop =
    hoveredIndex !== null ? (linePoints[hoveredIndex].y / HEIGHT) * 100 : 0;

  return (
    <div className={styles.wrap}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.chart}
        role="img"
        aria-label="Peak usage hours line chart"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient
            id="peakHoursFill"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={PADDING.top}
            x2="0"
            y2={BASELINE_Y}
          >
            <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.22} />
            <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
          </linearGradient>
          <filter id="peakLineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={LINE_COLOR} floodOpacity="0.45" />
          </filter>
          <filter id="peakDotGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={LINE_COLOR} floodOpacity="0.6" />
          </filter>
        </defs>

        {yTicks.map((tick) => {
          const y = plotY(tick, safeYMax, PADDING.top, PLOT_HEIGHT);
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={WIDTH - PADDING.right}
                y2={y}
                className={styles.gridLine}
              />
              <text x={PADDING.left - 8} y={y + 4} className={styles.axisLabel} textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((point, index) => {
          const x = plotX(index, COUNT, PADDING.left, PLOT_WIDTH);
          const isHovered = hoveredIndex === index;
          return (
            <rect
              key={`band-${point.label}`}
              x={x - bandWidth / 2}
              y={PADDING.top}
              width={bandWidth}
              height={PLOT_HEIGHT}
              rx={isHovered ? 5 : 0}
              className={`${styles.hoverBand} ${isHovered ? styles.hoverBandVisible : ""}`}
            />
          );
        })}

        <path
          d={smoothAreaPath(linePoints, BASELINE_Y)}
          fill="url(#peakHoursFill)"
          className={styles.area}
        />

        {hoveredIndex !== null ? (
          <line
            x1={hoverX}
            y1={PADDING.top}
            x2={hoverX}
            y2={BASELINE_Y}
            className={styles.crosshair}
          />
        ) : null}

        <path
          d={smoothLinePath(linePoints)}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={2.5}
          filter="url(#peakLineGlow)"
          className={styles.line}
        />

        {linePoints.map((p, i) => {
          const active = hoveredIndex === i;
          return (
            <g key={data[i].label} pointerEvents="none">
              {active ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={8}
                  fill={LINE_COLOR}
                  fillOpacity={0.2}
                  filter="url(#peakDotGlow)"
                />
              ) : null}
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 5 : 3}
                fill={LINE_COLOR}
                stroke={active ? "#fff" : "none"}
                strokeWidth={active ? 1.5 : 0}
                strokeOpacity={0.35}
              />
            </g>
          );
        })}

        {data.map((point, index) => {
          const x = plotX(index, COUNT, PADDING.left, PLOT_WIDTH);
          return (
            <g key={`hit-${point.label}`}>
              {point.showLabel !== false ? (
                <text x={x} y={HEIGHT - 8} className={styles.xLabel} textAnchor="middle">
                  {point.label}
                </text>
              ) : null}
              <rect
                x={x - bandWidth / 2}
                y={PADDING.top}
                width={bandWidth}
                height={PLOT_HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
              />
            </g>
          );
        })}
      </svg>

      {hovered ? (
        <div
          className={styles.tooltip}
          style={{ left: `${tooltipLeft}%`, top: `${tooltipTop}%` }}
          role="tooltip"
        >
          <span className={styles.tooltipTitle}>{hovered.label}</span>
          <span className={styles.tooltipValue}>{hovered.value} searches</span>
        </div>
      ) : null}
    </div>
  );
}
