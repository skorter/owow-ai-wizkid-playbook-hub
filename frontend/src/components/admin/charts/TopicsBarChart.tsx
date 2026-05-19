"use client";

import { useState } from "react";
import type { SearchedTopic } from "@/data/adminMockData";
import styles from "./TopicsBarChart.module.css";

const CHART_WIDTH = 480;
const CHART_HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 40, left: 44 };

type TopicsBarChartProps = {
  topics: SearchedTopic[];
  yMax: number;
  yTicks: number[];
  emptyMessage?: string;
};

export default function TopicsBarChart({
  topics,
  yMax,
  yTicks,
  emptyMessage = "No search data yet.",
}: TopicsBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const safeYMax = yMax > 0 ? yMax : 10;

  if (topics.length === 0) {
    return <p className={styles.emptyState}>{emptyMessage}</p>;
  }

  function getSlotLayout(index: number) {
    const slotWidth = plotWidth / topics.length;
    const barWidth = slotWidth * 0.52;
    const slotX = PADDING.left + index * slotWidth;
    const x = slotX + (slotWidth - barWidth) / 2;
    return { slotX, slotWidth, barWidth, x };
  }

  const hoveredTopic = hoveredIndex !== null ? topics[hoveredIndex] : null;
  const tooltipLayout = hoveredIndex !== null ? getSlotLayout(hoveredIndex) : null;

  const tooltipLeftPercent = tooltipLayout
    ? ((tooltipLayout.x + tooltipLayout.barWidth / 2) / CHART_WIDTH) * 100
    : 0;

  const tooltipTopPercent = hoveredTopic
    ? ((PADDING.top +
        plotHeight -
        (hoveredTopic.value / safeYMax) * plotHeight -
        12) /
        CHART_HEIGHT) *
      100
    : 0;

  return (
    <div className={styles.wrap}>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className={styles.chart}
        role="img"
        aria-label="Most searched topics bar chart"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {yTicks.map((tick) => {
          const y = PADDING.top + plotHeight - (tick / safeYMax) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={CHART_WIDTH - PADDING.right}
                y2={y}
                className={styles.gridLine}
              />
              <text x={PADDING.left - 8} y={y + 4} className={styles.axisLabel} textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}

        {topics.map((topic, index) => {
          const { slotX, slotWidth, barWidth, x } = getSlotLayout(index);
          const barHeight = (topic.value / safeYMax) * plotHeight;
          const y = PADDING.top + plotHeight - barHeight;
          const isHovered = hoveredIndex === index;

          return (
            <g key={`${topic.label}-${index}`}>
              <rect
                x={slotX}
                y={PADDING.top}
                width={slotWidth}
                height={plotHeight}
                className={`${styles.highlight} ${isHovered ? styles.highlightVisible : ""}`}
              />
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                ry={4}
                className={`${styles.bar} ${isHovered ? styles.barHovered : ""}`}
              />
              <rect
                x={slotX}
                y={PADDING.top}
                width={slotWidth}
                height={plotHeight}
                fill="transparent"
                className={styles.hitArea}
                onMouseEnter={() => setHoveredIndex(index)}
              />
              <text
                x={x + barWidth / 2}
                y={CHART_HEIGHT - 12}
                className={styles.xLabel}
                textAnchor="middle"
              >
                {topic.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredTopic && tooltipLayout ? (
        <div
          className={styles.tooltip}
          style={{
            left: `${tooltipLeftPercent}%`,
            top: `${tooltipTopPercent}%`,
          }}
          role="tooltip"
        >
          <span className={styles.tooltipTitle}>{hoveredTopic.label}</span>
          <span className={styles.tooltipValue}>count: {hoveredTopic.value}</span>
        </div>
      ) : null}
    </div>
  );
}
