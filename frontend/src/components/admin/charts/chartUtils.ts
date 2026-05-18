export type ChartPoint = { x: number; y: number };

export function smoothLinePath(points: ChartPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

/** Closed path from smooth line down to baseline for gradient area fill */
export function smoothAreaPath(points: ChartPoint[], baselineY: number): string {
  const line = smoothLinePath(points);
  if (!line || points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export function plotX(
  index: number,
  count: number,
  plotLeft: number,
  plotWidth: number,
): number {
  if (count <= 1) return plotLeft;
  return plotLeft + (index / (count - 1)) * plotWidth;
}

export function plotY(
  value: number,
  yMax: number,
  plotTop: number,
  plotHeight: number,
): number {
  return plotTop + plotHeight - (value / yMax) * plotHeight;
}
