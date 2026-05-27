"use client";

import { useEffect, useRef } from "react";
import styles from "./TransitionOverlay.module.css";

export interface TransitionOverlayProps {
  type: "employee" | "management" | "onboarding";
  originX: number;
  originY: number;
  phase: "in" | "out";
  onInComplete: () => void;
  onOutComplete: () => void;
}

type Particle = {
  angle: number;
  distance: number;
  spin: number;
};

const SETTLE_MS = 100;
const EMPLOYEE_COVER = "#f5c842";

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

function paintSolid(ctx: CanvasRenderingContext2D, W: number, H: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
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

const EMPLOYEE_SETTLE_MS = 180;
const EMPLOYEE_COLS = 8;
const EMPLOYEE_ROWS = 6;

type EmployeeBlockState = "waiting" | "dropping" | "settled" | "leaving";

type EmployeeBlock = {
  col: number;
  row: number;
  state: EmployeeBlockState;
  y: number;
  targetY: number;
  triggerFrame: number;
  velocity: number;
  fallVelocity: number;
  shade: number;
};

function createEmployeeBlocks(W: number, H: number, phase: "in" | "out"): EmployeeBlock[] {
  const blockH = H / EMPLOYEE_ROWS;
  const blocks: EmployeeBlock[] = [];

  for (let col = 0; col < EMPLOYEE_COLS; col++) {
    for (let row = 0; row < EMPLOYEE_ROWS; row++) {
      const targetY = row * blockH;
      const shade = Math.random() * 0.12 - 0.06;
      const triggerFrame =
        phase === "in"
          ? col * 6 + (EMPLOYEE_ROWS - 1 - row) * 10
          : col * 4 + row * 7;

      blocks.push({
        col,
        row,
        state: phase === "in" ? "waiting" : "leaving",
        y: phase === "in" ? targetY - blockH * 1.4 : targetY,
        targetY,
        triggerFrame,
        velocity: 0,
        fallVelocity: 0,
        shade,
      });
    }
  }

  return blocks;
}

function employeeBlockFillStyle(shade: number): string {
  const g = 200 + shade * 40;
  const b = 66 + shade * 30;
  return `rgba(245, ${Math.round(g)}, ${Math.round(b)}, 1)`;
}

function drawEmployeeBlocks(
  ctx: CanvasRenderingContext2D,
  blocks: EmployeeBlock[],
  blockW: number,
  blockH: number,
) {
  const drawW = blockW - 1;
  const drawH = blockH - 1;

  for (const block of blocks) {
    if (block.state === "waiting") continue;

    const x = block.col * blockW;
    const y =
      block.state === "settled"
        ? block.targetY
        : block.y;

    ctx.fillStyle = employeeBlockFillStyle(block.shade);
    ctx.fillRect(x, y, drawW, drawH);

    if (
      block.state === "settled" ||
      block.state === "dropping" ||
      (block.state === "leaving" && block.y <= block.targetY + 1)
    ) {
      ctx.strokeStyle = "rgba(255, 240, 160, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + drawW, y);
      ctx.stroke();

      ctx.strokeStyle = "rgba(180, 130, 10, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + drawH);
      ctx.lineTo(x + drawW, y + drawH);
      ctx.stroke();
    }
  }
}

function runEmployeeIn(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onInComplete: () => void,
): () => void {
  const blockW = W / EMPLOYEE_COLS;
  const blockH = H / EMPLOYEE_ROWS;
  const blocks = createEmployeeBlocks(W, H, "in");

  let frameId = 0;
  let frame = 0;
  let hasCompleted = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);
    frame++;

    for (const block of blocks) {
      if (block.state === "waiting" && frame >= block.triggerFrame) {
        block.state = "dropping";
        block.y = block.targetY - blockH * 1.4;
        block.velocity = 0;
      }

      if (block.state === "dropping") {
        const distance = block.targetY - block.y;
        block.velocity = block.velocity * 0.72 + distance * 0.28;
        block.y += block.velocity;

        if (Math.abs(block.y - block.targetY) < 0.5 && Math.abs(block.velocity) < 0.5) {
          block.y = block.targetY;
          block.state = "settled";
          block.velocity = 0;
        }
      }
    }

    drawEmployeeBlocks(ctx, blocks, blockW, blockH);

    const allSettled = blocks.every((b) => b.state === "settled");

    if (allSettled && !hasCompleted) {
      hasCompleted = true;
      paintSolid(ctx, W, H, EMPLOYEE_COVER);
      timeoutId = setTimeout(() => {
        onInComplete();
      }, EMPLOYEE_SETTLE_MS);
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, W, H);
  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  };
}

function runEmployeeOut(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onOutComplete: () => void,
): () => void {
  const blockW = W / EMPLOYEE_COLS;
  const blockH = H / EMPLOYEE_ROWS;
  const blocks = createEmployeeBlocks(W, H, "out");

  let frameId = 0;
  let frame = 0;
  let hasCompleted = false;

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);
    frame++;

    for (const block of blocks) {
      if (frame >= block.triggerFrame) {
        block.fallVelocity += 1.1;
        block.y += block.fallVelocity;
      } else {
        block.y = block.targetY;
      }
    }

    drawEmployeeBlocks(ctx, blocks, blockW, blockH);

    const allGone = blocks.every((b) => b.y > H);

    if (allGone && !hasCompleted) {
      hasCompleted = true;
      onOutComplete();
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  paintSolid(ctx, W, H, EMPLOYEE_COVER);
  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
  };
}

function runManagementIn(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onInComplete: () => void,
): () => void {
  const cx = W / 2;
  const cy = H / 2;
  const minDim = Math.min(W, H);
  const r1 = minDim * 0.38;
  const r2 = minDim * 0.26;
  const r3 = minDim * 0.14;
  const coverRadius = Math.hypot(W, H) / 2 + 10;
  const coverColor = "#534AB7";

  let frame = 0;
  let rot1 = 0;
  let rot2 = 0;
  let rot3 = 0;
  let irisRadius = 0;
  let irisActive = false;
  let frameId = 0;
  let finishScheduled = false;
  let hasNavigated = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

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

      ctx.fillStyle = coverColor;
      ctx.beginPath();
      ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
      ctx.fill();
      irisRadius += minDim * 0.025;

      if (irisRadius >= coverRadius && !finishScheduled) {
        finishScheduled = true;
        paintSolid(ctx, W, H, coverColor);
        timeoutId = setTimeout(() => {
          if (!hasNavigated) {
            hasNavigated = true;
            onInComplete();
          }
        }, SETTLE_MS);
        return;
      }
    }

    frame++;
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frameId);
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  };
}

function runManagementOut(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onOutComplete: () => void,
): () => void {
  const cx = W / 2;
  const cy = H / 2;
  const coverRadius = Math.hypot(W, H) / 2 + 10;
  const coverColor = "#534AB7";
  const shrinkPerFrame = coverRadius / 42;

  let irisRadius = coverRadius;
  let frameId = 0;
  let finishScheduled = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const tick = () => {
    paintSolid(ctx, W, H, coverColor);

    ctx.fillStyle = coverColor;
    ctx.beginPath();
    ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
    ctx.fill();

    irisRadius -= shrinkPerFrame;

    if (irisRadius <= 0 && !finishScheduled) {
      finishScheduled = true;
      timeoutId = setTimeout(() => {
        onOutComplete();
      }, 50);
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  paintSolid(ctx, W, H, coverColor);
  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  };
}

function runOnboardingIn(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onInComplete: () => void,
): () => void {
  const cx = W / 2;
  const cy = H / 2;
  const minDim = Math.min(W, H);
  const coverRadius = Math.hypot(W, H) / 2 + 10;
  const coverColor = "rgba(4, 52, 44, 0.97)";

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
  let finishScheduled = false;
  let hasNavigated = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

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
      ctx.fillStyle = coverColor;
      ctx.beginPath();
      ctx.arc(cx, cy, fillRadius, 0, Math.PI * 2);
      ctx.fill();

      if (fillRadius >= coverRadius && !finishScheduled) {
        finishScheduled = true;
        paintSolid(ctx, W, H, coverColor);
        timeoutId = setTimeout(() => {
          if (!hasNavigated) {
            hasNavigated = true;
            onInComplete();
          }
        }, SETTLE_MS);
        return;
      }
    }

    frame++;
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frameId);
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  };
}

function runOnboardingOut(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  onOutComplete: () => void,
): () => void {
  const cx = W / 2;
  const cy = H / 2;
  const coverRadius = Math.hypot(W, H) / 2 + 10;
  const coverColor = "rgba(4, 52, 44, 0.97)";
  const shrinkPerFrame = coverRadius / 42;

  let fillRadius = coverRadius;
  let frameId = 0;
  let finishScheduled = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const tick = () => {
    paintSolid(ctx, W, H, coverColor);

    ctx.fillStyle = coverColor;
    ctx.beginPath();
    ctx.arc(cx, cy, fillRadius, 0, Math.PI * 2);
    ctx.fill();

    fillRadius -= shrinkPerFrame;

    if (fillRadius <= 0 && !finishScheduled) {
      finishScheduled = true;
      timeoutId = setTimeout(() => {
        onOutComplete();
      }, 50);
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  paintSolid(ctx, W, H, coverColor);
  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  };
}

export default function TransitionOverlay({
  type,
  originX,
  originY,
  phase,
  onInComplete,
  onOutComplete,
}: TransitionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onInCompleteRef = useRef(onInComplete);
  const onOutCompleteRef = useRef(onOutComplete);

  useEffect(() => {
    onInCompleteRef.current = onInComplete;
  }, [onInComplete]);

  useEffect(() => {
    onOutCompleteRef.current = onOutComplete;
  }, [onOutComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;

    const { ctx, W, H } = setup;
    const completeIn = () => onInCompleteRef.current();
    const completeOut = () => onOutCompleteRef.current();

    let cleanup: (() => void) | undefined;

    if (phase === "in") {
      if (type === "employee") {
        cleanup = runEmployeeIn(ctx, W, H, completeIn);
      } else if (type === "management") {
        cleanup = runManagementIn(ctx, W, H, completeIn);
      } else {
        cleanup = runOnboardingIn(ctx, W, H, completeIn);
      }
    } else if (type === "employee") {
      cleanup = runEmployeeOut(ctx, W, H, completeOut);
    } else if (type === "management") {
      cleanup = runManagementOut(ctx, W, H, completeOut);
    } else {
      cleanup = runOnboardingOut(ctx, W, H, completeOut);
    }

    const onResize = () => {
      setupCanvas(canvas);
      if (phase === "out" && type === "employee") {
        paintSolid(ctx, W, H, EMPLOYEE_COVER);
      } else if (phase === "out" && type === "management") {
        paintSolid(ctx, W, H, "#534AB7");
      } else if (phase === "out" && type === "onboarding") {
        paintSolid(ctx, W, H, "rgba(4, 52, 44, 0.97)");
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      cleanup?.();
      window.removeEventListener("resize", onResize);
    };
  }, [type, originX, originY, phase]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.overlay}
      aria-hidden
    />
  );
}
