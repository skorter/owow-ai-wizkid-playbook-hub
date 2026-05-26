"use client";

import { useEffect, useRef } from "react";
import styles from "./TransitionOverlay.module.css";

export interface TransitionOverlayProps {
  type: "employee" | "management" | "onboarding";
  originX: number;
  originY: number;
  onComplete: () => void;
}

type Particle = {
  angle: number;
  distance: number;
  spin: number;
};

function setupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W, H };
}

function drawRingWithTicks(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  lineWidth: number,
  color: string,
  tickCount: number,
  rotation: number,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  const tickLen = radius * 0.06;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1;
  for (let i = 0; i < tickCount; i++) {
    const a = (i / tickCount) * Math.PI * 2;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    ctx.beginPath();
    ctx.moveTo(cos * (radius - tickLen), sin * (radius - tickLen));
    ctx.lineTo(cos * (radius + tickLen), sin * (radius + tickLen));
    ctx.stroke();
  }
  ctx.restore();
}

function runEmployeeAnimation(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  _originX: number,
  _originY: number,
  onComplete: () => void,
): () => void {
  const STRIP_COUNT = 10;
  const stripWidth = W / STRIP_COUNT;
  const coverThreshold = H + stripWidth;

  const strips = Array.from({ length: STRIP_COUNT }, (_, i) => ({
    offset: -H - stripWidth,
    speed: 4.5 + i * 0.5,
    delay: i * 6,
  }));

  let frameId = 0;
  let frame = 0;
  let completeCalled = false;
  let finishScheduled = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const tick = () => {
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);

    frame++;

    for (let i = 0; i < STRIP_COUNT; i++) {
      const strip = strips[i];
      if (frame >= strip.delay) {
        strip.offset += strip.speed;
      }

      const x = i * stripWidth;
      const angle = stripWidth * 0.4;
      const { offset } = strip;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, stripWidth, H);
      ctx.clip();

      ctx.fillStyle = "#f5c842";
      ctx.beginPath();
      ctx.moveTo(x - angle, -H + offset - stripWidth);
      ctx.lineTo(x + stripWidth, -H + offset - stripWidth);
      ctx.lineTo(x + stripWidth + angle, offset);
      ctx.lineTo(x, offset);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 240, 150, 0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + stripWidth, -H + offset - stripWidth);
      ctx.lineTo(x + stripWidth + angle, offset);
      ctx.stroke();

      ctx.restore();
    }

    const allCovered = strips.every((s) => s.offset >= coverThreshold);

    if (allCovered && !finishScheduled) {
      finishScheduled = true;
      ctx.fillStyle = "#f5c842";
      ctx.fillRect(0, 0, W, H);
      timeoutId = setTimeout(() => {
        if (!completeCalled) {
          completeCalled = true;
          onComplete();
        }
      }, 150);
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, W, H);
  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    ctx.clearRect(0, 0, W, H);
  };
}

function runManagementAnimation(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onComplete: () => void,
): () => void {
  const cx = W / 2;
  const cy = H / 2;
  const minDim = Math.min(W, H);
  const r1 = minDim * 0.38;
  const r2 = minDim * 0.26;
  const r3 = minDim * 0.14;
  const coverRadius = Math.hypot(W, H) / 2 + 10;

  let frame = 0;
  let rot1 = 0;
  let rot2 = 0;
  let rot3 = 0;
  let irisRadius = 0;
  let irisActive = false;
  let frameId = 0;

  const tick = () => {
    ctx.fillStyle = "#0a0812";
    ctx.fillRect(0, 0, W, H);

    if (!irisActive) {
      if (frame < 90) {
        rot1 += 0.02;
        rot2 -= 0.03;
        rot3 += 0.045;
      }
      drawRingWithTicks(ctx, cx, cy, r1, 4, "#7F77DD", 12, rot1);
      drawRingWithTicks(ctx, cx, cy, r2, 3, "#534AB7", 8, rot2);
      drawRingWithTicks(ctx, cx, cy, r3, 2.5, "#AFA9EC", 6, rot3);

      if (frame >= 90 && !irisActive) {
        irisActive = true;
        irisRadius = minDim * 0.025;
      }
    } else {
      drawRingWithTicks(ctx, cx, cy, r1, 4, "#7F77DD", 12, rot1);
      drawRingWithTicks(ctx, cx, cy, r2, 3, "#534AB7", 8, rot2);
      drawRingWithTicks(ctx, cx, cy, r3, 2.5, "#AFA9EC", 6, rot3);

      ctx.fillStyle = "#534AB7";
      ctx.beginPath();
      ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
      ctx.fill();
      irisRadius += minDim * 0.025;

      if (irisRadius >= coverRadius) {
        onComplete();
        return;
      }
    }

    frame++;
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frameId);
}

function runOnboardingAnimation(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onComplete: () => void,
): () => void {
  const cx = W / 2;
  const cy = H / 2;
  const minDim = Math.min(W, H);
  const coverRadius = Math.hypot(W, H) / 2 + 10;

  const rings = Array.from({ length: 9 }, (_, i) => ({
    radius: 0,
    speed: (2.5 + (i % 5) * 0.75) * 0.6,
    color:
      i % 2 === 0
        ? "rgba(29, 158, 117, 0.85)"
        : "rgba(93, 202, 165, 0.85)",
  }));

  const particles: Particle[] = Array.from({ length: 55 }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: 10 + Math.random() * 80,
    spin: 0.03 + Math.random() * 0.05,
  }));

  let frame = 0;
  let fillRadius = 0;
  let fillActive = false;
  let frameId = 0;

  const tick = () => {
    ctx.clearRect(0, 0, W, H);

    for (const ring of rings) {
      ring.radius += ring.speed;
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (frame >= 20) {
      ctx.strokeStyle = "rgba(93, 202, 165, 0.85)";
      ctx.lineWidth = 1.5;
      for (const p of particles) {
        const x = cx + Math.cos(p.angle) * p.distance;
        const y = cy + Math.sin(p.angle) * p.distance;
        const x2 = x + Math.cos(p.angle + 0.4) * 8;
        const y2 = y + Math.sin(p.angle + 0.4) * 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        p.angle += p.spin;
        p.distance = Math.max(0, p.distance - 0.2);
      }
    }

    if (frame >= 80) {
      fillActive = true;
    }

    if (fillActive) {
      fillRadius += minDim * 0.025;
      ctx.fillStyle = "rgba(4, 52, 44, 0.97)";
      ctx.beginPath();
      ctx.arc(cx, cy, fillRadius, 0, Math.PI * 2);
      ctx.fill();

      if (fillRadius >= coverRadius) {
        onComplete();
        return;
      }
    }

    frame++;
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frameId);
}

export default function TransitionOverlay({
  type,
  originX,
  originY,
  onComplete,
}: TransitionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;

    const { ctx, W, H } = setup;
    const complete = () => onCompleteRef.current();

    let cleanup: (() => void) | undefined;

    if (type === "employee") {
      cleanup = runEmployeeAnimation(ctx, W, H, originX, originY, complete);
    } else if (type === "management") {
      cleanup = runManagementAnimation(ctx, W, H, complete);
    } else {
      cleanup = runOnboardingAnimation(ctx, W, H, complete);
    }

    const onResize = () => {
      setupCanvas(canvas);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cleanup?.();
      window.removeEventListener("resize", onResize);
    };
  }, [type, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.overlay}
      aria-hidden
    />
  );
}
