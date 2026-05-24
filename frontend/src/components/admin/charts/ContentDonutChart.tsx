"use client";
import { useMemo, useState } from "react";
import type { ContentDistributionSegment } from "@/data/adminMockData";
import styles from "./ContentDonutChart.module.css";

const SIZE = 260;
const CX = 130;
const CY = 130;
const RADIUS = 72;
const STROKE_WIDTH = 32;
const SEGMENT_GAP = 3;
const HIT_STROKE_WIDTH = 40;

const circumference = 2 * Math.PI * RADIUS;
const HOLE_RADIUS = RADIUS - STROKE_WIDTH / 2 - 1;

type RingSegment = ContentDistributionSegment & {
  dashLength: number;
  dashoffset: number;
  midAngle: number;
};

function buildRings(segments: ContentDistributionSegment[]): RingSegment[] {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 100;
  let cumulativeOffset = 0;

  return segments.map((segment) => {
    const share = segment.value / total;
    const segmentArc = share * circumference;
    const dashLength = Math.max(segmentArc - SEGMENT_GAP, 0);
    const dashoffset = -cumulativeOffset;
    const midArc = cumulativeOffset + segmentArc / 2;
    const midAngle = (midArc / circumference) * 2 * Math.PI - Math.PI / 2;
    cumulativeOffset += segmentArc;

    return {
      ...segment,
      dashLength,
      dashoffset,
      midAngle,
    };
  });
}

type ContentDonutChartProps = {
  segments: ContentDistributionSegment[];
  emptyMessage?: string;
};

export default function ContentDonutChart({
  segments,
  emptyMessage = "No published articles to chart yet.",
}: ContentDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rings = useMemo(() => buildRings(segments), [segments]);

  if (segments.length === 0) {
    return <p className={styles.emptyState}>{emptyMessage}</p>;
  }

  const hovered = hoveredIndex !== null ? rings[hoveredIndex] : null;

  const tooltipLeft = hovered !== null ? 50 + Math.cos(hovered.midAngle) * 38 : 50;
  const tooltipTop = hovered !== null ? 50 + Math.sin(hovered.midAngle) * 38 : 50;

  return (
    <div className={styles.wrap}>
      <div className={styles.chartArea}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={styles.chart}
          role="img"
          aria-label="Content distribution donut chart"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            {rings.map((segment, index) => {
              const isHovered = hoveredIndex === index;
              const isDimmed = hoveredIndex !== null && !isHovered;

              return (
                <g key={`${segment.label}-${index}`}>
                  <circle
                    cx={CX}
                    cy={CY}
                    r={RADIUS}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={HIT_STROKE_WIDTH}
                    strokeDasharray={`${segment.dashLength} ${circumference - segment.dashLength}`}
                    strokeDashoffset={segment.dashoffset}
                    className={styles.hitRing}
                    onMouseEnter={() => setHoveredIndex(index)}
                  />
                  <circle
                    cx={CX}
                    cy={CY}
                    r={RADIUS}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={isHovered ? STROKE_WIDTH + 3 : STROKE_WIDTH}
                    strokeDasharray={`${segment.dashLength} ${circumference - segment.dashLength}`}
                    strokeDashoffset={segment.dashoffset}
                    strokeLinecap="butt"
                    className={`${styles.segment} ${isDimmed ? styles.segmentDimmed : ""} ${isHovered ? styles.segmentHovered : ""}`}
                    style={{ filter: isHovered ? "brightness(1.15)" : undefined }}
                    pointerEvents="none"
                  />
                </g>
              );
            })}
          </g>
          <circle cx={CX} cy={CY} r={HOLE_RADIUS} className={styles.hole} />
        </svg>

        {hovered ? (
          <div
            className={styles.tooltip}
            style={{ left: `${tooltipLeft}%`, top: `${tooltipTop}%` }}
            role="tooltip"
          >
            <span className={styles.tooltipTitle}>{hovered.label}</span>
            <span className={styles.tooltipValue} style={{ color: hovered.color }}>
              {hovered.value}%
            </span>
          </div>
        ) : null}
      </div>

      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li key={segment.label} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: segment.color }} />
            <span className={styles.legendLabel}>{segment.label}</span>
            <span className={styles.legendValue}>{segment.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
