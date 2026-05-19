"use client";

import { useState } from "react";
import {
  searchedTopics,
  SEARCHED_TOPICS_Y_MAX,
  SEARCHED_TOPICS_Y_TICKS,
} from "@/data/adminMockData";
import styles from "./TopicsBarChart.module.css";

const CHART_WIDTH = 480;
const CHART_HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 40, left: 44 };
const PLOT_WIDTH = CHART_WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = CHART_HEIGHT - PADDING.top - PADDING.bottom;

function getSlotLayout(index: number) {
  const slotWidth = PLOT_WIDTH / searchedTopics.length;
  const barWidth = slotWidth * 0.52;
  const slotX = PADDING.left + index * slotWidth;
  const x = slotX + (slotWidth - barWidth) / 2;
  return { slotX, slotWidth, barWidth, x };
}

export default function TopicsBarChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hoveredTopic = hoveredIndex !== null ? searchedTopics[hoveredIndex] : null;
  const tooltipLayout =
    hoveredIndex !== null ? getSlotLayout(hoveredIndex) : null;

  const tooltipLeftPercent = tooltipLayout
    ? ((tooltipLayout.x + tooltipLayout.barWidth / 2) / CHART_WIDTH) * 100
    : 0;

  const tooltipTopPercent = hoveredTopic
    ? ((PADDING.top +
        PLOT_HEIGHT -
        (hoveredTopic.value / SEARCHED_TOPICS_Y_MAX) * PLOT_HEIGHT -
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
        {SEARCHED_TOPICS_Y_TICKS.map((tick) => {
          const y =
            PADDING.top + PLOT_HEIGHT - (tick / SEARCHED_TOPICS_Y_MAX) * PLOT_HEIGHT;
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

        {searchedTopics.map((topic, index) => {
          const { slotX, slotWidth, barWidth, x } = getSlotLayout(index);
          const barHeight = (topic.value / SEARCHED_TOPICS_Y_MAX) * PLOT_HEIGHT;
          const y = PADDING.top + PLOT_HEIGHT - barHeight;
          const isHovered = hoveredIndex === index;

          return (
            <g key={topic.label}>
              <rect
                x={slotX}
                y={PADDING.top}
                width={slotWidth}
                height={PLOT_HEIGHT}
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
                height={PLOT_HEIGHT}
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
