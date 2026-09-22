"use client";

import { useEffect, useRef } from "react";
import styles from "./PaperFeatureGraphic.module.css";
import { usePaperFeatureMotion } from "./PaperFeatureMotion";

const WAVE_OFFSETS = [-164, -116, -74, -36, 38, 80, 126, 176];
const TRAVEL_PER_SECOND = 18;
const START_TRAVEL = 350;
const END_TRAVEL = 472;

function elevationAt(worldX: number) {
  return (
    worldX * 0.34 + Math.sin(worldX / 94) * 10 + Math.sin(worldX / 41) * 3.8
  );
}

function cursorPosition(width: number, height: number, elapsed: number) {
  const settle = 1 - Math.exp(-elapsed / 1.6);

  return {
    x: width * (0.73 + settle * 0.07),
    y: height * (0.31 - settle * 0.07),
  };
}

function screenYAt(
  screenX: number,
  travel: number,
  cursorX: number,
  cursorY: number,
) {
  const worldX = travel + screenX - cursorX;
  return cursorY - (elevationAt(worldX) - elevationAt(travel));
}

function traceAscent(
  context: CanvasRenderingContext2D,
  travel: number,
  cursorX: number,
  cursorY: number,
  endX: number,
) {
  context.beginPath();

  for (let x = -24; x <= endX + 3; x += 3) {
    const y = screenYAt(x, travel, cursorX, cursorY);
    if (x === -24) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
}

function drawWaveField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  travel: number,
  cursorX: number,
  cursorY: number,
) {
  const waveStroke = context.createLinearGradient(0, 0, width, 0);
  waveStroke.addColorStop(0, "rgba(43, 76, 52, 0.025)");
  waveStroke.addColorStop(0.12, "rgba(43, 76, 52, 0.12)");
  waveStroke.addColorStop(0.86, "rgba(43, 76, 52, 0.105)");
  waveStroke.addColorStop(1, "rgba(43, 76, 52, 0.02)");

  WAVE_OFFSETS.forEach((offset, waveIndex) => {
    context.beginPath();

    for (let x = -28; x <= width + 28; x += 4) {
      const worldX = travel + x - cursorX;
      const ripple =
        Math.sin(worldX / (72 + waveIndex * 3) + waveIndex * 0.72) *
          (4.5 + (waveIndex % 3) * 1.2) +
        Math.sin(worldX / 31 - waveIndex * 0.58) * 1.5;
      const y = screenYAt(x, travel, cursorX, cursorY) + offset + ripple;

      if (x === -28) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.strokeStyle = waveStroke;
    context.lineWidth = waveIndex === 3 || waveIndex === 4 ? 1.1 : 0.85;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  });

  const glow = context.createRadialGradient(
    cursorX + 12,
    cursorY - 6,
    0,
    cursorX + 12,
    cursorY - 6,
    Math.max(width, height) * 0.28,
  );
  glow.addColorStop(0, "rgba(92, 218, 118, 0.17)");
  glow.addColorStop(0.48, "rgba(92, 218, 118, 0.06)");
  glow.addColorStop(1, "rgba(92, 218, 118, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

function drawAscentField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  travel: number,
  cursorX: number,
  cursorY: number,
) {
  context.clearRect(0, 0, width, height);
  drawWaveField(context, width, height, travel, cursorX, cursorY);

  traceAscent(context, travel, cursorX, cursorY, width + 24);
  context.strokeStyle = "rgba(46, 76, 55, 0.24)";
  context.lineWidth = 1.4;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();

  traceAscent(context, travel, cursorX, cursorY, cursorX + 1);
  const ascentGradient = context.createLinearGradient(0, 0, cursorX, 0);
  ascentGradient.addColorStop(0, "rgba(64, 151, 86, 0.52)");
  ascentGradient.addColorStop(0.62, "rgba(53, 190, 83, 0.78)");
  ascentGradient.addColorStop(1, "rgba(42, 205, 75, 0.98)");
  context.strokeStyle = ascentGradient;
  context.lineWidth = 2.5;
  context.shadowColor = "rgba(58, 196, 87, 0.24)";
  context.shadowBlur = 7;
  context.stroke();
  context.shadowBlur = 0;
}

export function PaperImprovementGraphic() {
  const playback = usePaperFeatureMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursorElement = cursorRef.current;
    if (!canvas || !cursorElement) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const draw = () => {
      if (width === 0 || height === 0) return;

      const elapsed = playback === "static" ? 8 : elapsedRef.current;
      const travel = playback === "static"
        ? END_TRAVEL
        : START_TRAVEL + elapsed * TRAVEL_PER_SECOND;
      const cursor = cursorPosition(width, height, elapsed);

      drawAscentField(context, width, height, travel, cursor.x, cursor.y);
      cursorElement.style.left = `${(cursor.x / width) * 100}%`;
      cursorElement.style.top = `${(cursor.y / height) * 100}%`;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    if (playback !== "active") {
      return () => resizeObserver.disconnect();
    }

    let previousTimestamp: number | null = null;
    const render = (timestamp: number) => {
      if (previousTimestamp !== null) {
        elapsedRef.current += Math.min(timestamp - previousTimestamp, 64) / 1_000;
      }
      previousTimestamp = timestamp;
      draw();
      animationFrame = window.requestAnimationFrame(render);
    };

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [playback]);

  return (
    <div
      aria-hidden="true"
      className={styles.canvas}
      data-variant="improvement"
    >
      <div className={styles.improvementField}>
        <canvas className={styles.improvementFieldCanvas} ref={canvasRef} />

        <span
          className={styles.improvementAscentCursor}
          ref={cursorRef}
          style={{
            left: "80%",
            top: "24%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}

export default PaperImprovementGraphic;
