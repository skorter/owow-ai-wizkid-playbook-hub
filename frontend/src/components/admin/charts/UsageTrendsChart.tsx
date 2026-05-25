"use client";

import { useState } from "react";
import type { UsageTrendPoint } from "@/data/adminMockData";
import { plotX, plotY, smoothAreaPath, smoothLinePath } from "./chartUtils";
import styles from "./UsageTrendsChart.module.css";
import ChartEmptyPlaceholder from "./ChartEmptyPlaceholder";
import { LineChart } from "lucide-react";

const WIDTH = 800;
const HEIGHT = 220;
const PADDING = { top: 12, right: 20, bottom: 40, left: 44 };

const SEARCH_COLOR = "#ffd500";
const USERS_COLOR = "#22d3ee";

type UsageTrendsChartProps = {
  data: UsageTrendPoint[];
  yMax: number;
  yTicks: number[];
  emptyMessage?: string;
};

export default function UsageTrendsChart({
  data,
  yMax,
  yTicks,
  emptyMessage = "No usage data for this period yet.",
}: UsageTrendsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const safeYMax = yMax > 0 ? yMax : 10;
  const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
  const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;
  const BASELINE_Y = PADDING.top + PLOT_HEIGHT;
  const COUNT = data.length;

  const hasActivity = data.some(
    (point) => point.searches > 0 || point.activeUsers > 0,
  );

  if (COUNT === 0 || !hasActivity) {
    return (
      <ChartEmptyPlaceholder
        icon={LineChart}
        title="Usage trends will appear here"
        description={
          emptyMessage ||
          "Employee searches and active users will be charted once the playbook becomes active."
        }
      />
    );
  }

  function buildSeries(getValue: (i: number) => number) {
    return data.map((_, index) => ({
      x: plotX(index, COUNT, PADDING.left, PLOT_WIDTH),
      y: plotY(getValue(index), safeYMax, PADDING.top, PLOT_HEIGHT),
    }));
  }

  const searchPoints = buildSeries((i) => data[i].searches);
  const userPoints = buildSeries((i) => data[i].activeUsers);

  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoverX =
    hoveredIndex !== null ? plotX(hoveredIndex, COUNT, PADDING.left, PLOT_WIDTH) : 0;
  const bandWidth = PLOT_WIDTH / COUNT;

  const tooltipLeft = (hoverX / WIDTH) * 100;
  const tooltipTop =
    hoveredIndex !== null
      ? (Math.min(searchPoints[hoveredIndex].y, userPoints[hoveredIndex].y) / HEIGHT) * 100
      : 0;

  return (
    <div className={styles.wrap}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.chart}
        role="img"
        aria-label="Usage trends line chart"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient
            id="usageSearchFill"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={PADDING.top}
            x2="0"
            y2={BASELINE_Y}
          >
            <stop offset="0%" stopColor={SEARCH_COLOR} stopOpacity={0.28} />
            <stop offset="100%" stopColor={SEARCH_COLOR} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="usageUsersFill"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={PADDING.top}
            x2="0"
            y2={BASELINE_Y}
          >
            <stop offset="0%" stopColor={USERS_COLOR} stopOpacity={0.22} />
            <stop offset="100%" stopColor={USERS_COLOR} stopOpacity={0} />
          </linearGradient>
          <filter id="usageSearchGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={SEARCH_COLOR} floodOpacity="0.5" />
          </filter>
          <filter id="usageUsersGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={USERS_COLOR} floodOpacity="0.45" />
          </filter>
          <filter id="usageDotGlowYellow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={SEARCH_COLOR} floodOpacity="0.65" />
          </filter>
          <filter id="usageDotGlowCyan" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={USERS_COLOR} floodOpacity="0.6" />
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
              <text x={PADDING.left - 10} y={y + 4} className={styles.axisLabel} textAnchor="end">
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
              rx={isHovered ? 6 : 0}
              className={`${styles.hoverBand} ${isHovered ? styles.hoverBandVisible : ""}`}
            />
          );
        })}

        <path
          d={smoothAreaPath(userPoints, BASELINE_Y)}
          fill="url(#usageUsersFill)"
          className={styles.area}
        />
        <path
          d={smoothAreaPath(searchPoints, BASELINE_Y)}
          fill="url(#usageSearchFill)"
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
          d={smoothLinePath(userPoints)}
          fill="none"
          stroke={USERS_COLOR}
          strokeWidth={2.5}
          filter="url(#usageUsersGlow)"
          className={styles.line}
        />
        <path
          d={smoothLinePath(searchPoints)}
          fill="none"
          stroke={SEARCH_COLOR}
          strokeWidth={2.5}
          filter="url(#usageSearchGlow)"
          className={styles.line}
        />

        {searchPoints.map((p, i) => {
          const active = hoveredIndex === i;
          return (
            <g key={`s-${i}`} pointerEvents="none">
              {active ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={8}
                  fill={SEARCH_COLOR}
                  fillOpacity={0.2}
                  filter="url(#usageDotGlowYellow)"
                />
              ) : null}
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 5 : 3}
                fill={SEARCH_COLOR}
                stroke={active ? "#fff" : "none"}
                strokeWidth={active ? 1.5 : 0}
                strokeOpacity={0.35}
              />
            </g>
          );
        })}
        {userPoints.map((p, i) => {
          const active = hoveredIndex === i;
          return (
            <g key={`u-${i}`} pointerEvents="none">
              {active ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={8}
                  fill={USERS_COLOR}
                  fillOpacity={0.2}
                  filter="url(#usageDotGlowCyan)"
                />
              ) : null}
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 5 : 3}
                fill={USERS_COLOR}
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
              <text x={x} y={HEIGHT - 14} className={styles.xLabel} textAnchor="middle">
                {point.label}
              </text>
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
          <span className={styles.tooltipDate}>{hovered.label}</span>
          <span className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Searches</span>
            <span className={styles.tooltipSearches}>{hovered.searches}</span>
          </span>
          <span className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>Active Users</span>
            <span className={styles.tooltipUsers}>{hovered.activeUsers}</span>
          </span>
        </div>
      ) : null}

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: SEARCH_COLOR }} />
          Searches
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: USERS_COLOR }} />
          Active Users
        </span>
      </div>
    </div>
  );
}
