import { useEffect, useRef } from "react";

export default function SakuraWaveform({ volume }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId;
    let offset = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const midY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Detect dark mode
      const isDark = document.documentElement.classList.contains("dark");

      // Sakura gradient tuned per mode
      const gradient = ctx.createLinearGradient(0, 0, width, 0);

      if (isDark) {
        gradient.addColorStop(0, "rgba(251, 207, 232, 0.3)");
        gradient.addColorStop(0.3, "rgba(244, 114, 182, 0.9)");
        gradient.addColorStop(0.7, "rgba(236, 72, 153, 0.9)");
        gradient.addColorStop(1, "rgba(251, 207, 232, 0.3)");

        ctx.shadowColor = "rgba(244, 114, 182, 0.7)";
      } else {
        gradient.addColorStop(0, "rgba(244, 114, 182, 0.2)");
        gradient.addColorStop(0.4, "rgba(236, 72, 153, 0.8)");
        gradient.addColorStop(1, "rgba(244, 114, 182, 0.2)");

        ctx.shadowColor = "rgba(236, 72, 153, 0.4)";
      }

      ctx.lineWidth = 3;
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = isDark ? 10 : 6;

      // Wave amplitude
      const baseAmp = 4;
      const dynamicAmp = baseAmp + volume * 18;

      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const progress = (x + offset) / 16;
        const y =
          midY +
          Math.sin(progress) * dynamicAmp * Math.cos(progress / 3) +
          Math.sin((x + offset * 0.5) / 5) * 1.2;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0;
      offset += 2;
      frameId = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [volume]);

  // Detect dark or light mode from Tailwind's "dark" class
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div
      className={`relative w-full h-10 sm:h-11 rounded-2xl overflow-hidden border shadow-sm transition-colors
        ${
          isDark
            ? "bg-gradient-to-r from-black via-sakura-dark/40 to-black border-neutral-800/80 shadow-[0_0_22px_rgba(15,23,42,0.8)]"
            : "bg-gradient-to-r from-white via-pink-50 to-white border-neutral-300/70 shadow-[0_0_22px_rgba(255,200,220,0.7)]"
        }
      `}
    >
      {/* Soft sakura glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div
          className={`w-40 h-40 rounded-full blur-3xl animate-pulse
            ${isDark ? "bg-pink-500/10" : "bg-pink-400/20"}
          `}
        />
      </div>

      {/* Canvas */}
      <div className="pointer-events-none absolute inset-y-1 left-3 right-3">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
