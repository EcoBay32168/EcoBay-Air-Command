import { useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useApp } from "@/state/app";

/* ---------- status LED ---------- */
export function Led({
  color,
  pulse = false,
  label,
}: {
  color: string;
  pulse?: boolean;
  label?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block h-[7px] w-[7px] rounded-full ${pulse ? "eb-pulse-dot" : ""}`}
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      {label && (
        <span className="font-mono-eb text-[9px] uppercase tracking-[0.14em] text-[#8fa39a]">
          {label}
        </span>
      )}
    </span>
  );
}

/* ---------- section label ---------- */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px w-4 bg-[#00cf78]/60" />
      <span className="font-mono-eb text-[9px] font-medium uppercase tracking-[0.22em] text-[#8fa39a]">
        {children}
      </span>
    </div>
  );
}

/* ---------- sparkline (canvas) ---------- */
export function Sparkline({
  data,
  color = "#00cf78",
  height = 34,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || data.length < 2) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const lo = Math.min(...data);
    const hi = Math.max(...data);
    const span = hi - lo || 1;
    const px = (i: number) => (i / (data.length - 1)) * (w - 2) + 1;
    const py = (v: number) => h - 3 - ((v - lo) / span) * (h - 6);

    // area fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "44");
    grad.addColorStop(1, color + "00");
    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    data.forEach((v, i) => ctx.lineTo(px(i), py(v)));
    ctx.lineTo(px(data.length - 1), h);
    ctx.lineTo(px(0), h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    data.forEach((v, i) => ctx.lineTo(px(i), py(v)));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.lineJoin = "round";
    ctx.stroke();

    // last point
    const lx = px(data.length - 1);
    const ly = py(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [data, color]);

  return <canvas ref={ref} className="w-full" style={{ height }} />;
}

/* ---------- range bar ---------- */
export function RangeBar({
  value,
  range,
  status,
}: {
  value: number;
  range: [number, number];
  status: "good" | "warn" | "bad";
}) {
  const [lo, hi] = range;
  const pct = Math.min(100, Math.max(0, ((value - lo) / (hi - lo)) * 100));
  const color = status === "good" ? "#00cf78" : status === "warn" ? "#fbbf24" : "#f87171";
  return (
    <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-[#1a2540]">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}66` }}
      />
    </div>
  );
}

/* ---------- radial gauge ---------- */
export function Gauge({
  pct,
  color,
  size = 168,
  stroke = 10,
  children,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75; // 270° gauge
  const offset = arc * (1 - Math.min(1, Math.max(0, pct)));
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[225deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1a2540"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${c}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${c}`}
          strokeDashoffset={offset}
          className="eb-gauge-arc"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

/* ---------- toasts ---------- */
export function ToastStack() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-12 z-50 flex flex-col items-center gap-2 px-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="eb-toast-in pointer-events-auto flex w-full max-w-[300px] items-center gap-2.5 rounded-xl border px-3 py-2.5 backdrop-blur-md"
          style={{
            background: "rgba(12,18,32,0.92)",
            borderColor:
              t.kind === "ok" ? "#00cf7855" : t.kind === "err" ? "#f8717155" : "#22d3ee55",
          }}
        >
          {t.kind === "ok" ? (
            <CheckCircle2 size={16} className="shrink-0 text-[#00cf78]" />
          ) : t.kind === "err" ? (
            <AlertTriangle size={16} className="shrink-0 text-[#f87171]" />
          ) : (
            <Info size={16} className="shrink-0 text-[#22d3ee]" />
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold text-[#e9f2ec]">{t.title}</div>
            {t.sub && (
              <div className="font-mono-eb truncate text-[9px] uppercase tracking-[0.12em] text-[#8fa39a]">
                {t.sub}
              </div>
            )}
          </div>
          <button onClick={() => dismissToast(t.id)} className="shrink-0 text-[#8fa39a]">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------- spinner ---------- */
export function Spinner({ size = 14, color = "#00cf78" }: { size?: number; color?: string }) {
  return (
    <span
      className="eb-spin inline-block rounded-full border-2 border-transparent"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderRightColor: color,
      }}
    />
  );
}
