import { useEffect, useState } from "react";
import { ArrowLeft, Bluetooth, RefreshCw, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { useApp } from "@/state/app";
import { DEVICE_BLE_NAME } from "@/data/device";
import { SectionLabel } from "@/components/widgets";

interface FoundDevice {
  name: string;
  rssi: number;
  kind: string;
}

const SCAN_RESULTS: FoundDevice[] = [
  { name: DEVICE_BLE_NAME, rssi: -52, kind: "MG111 WiFi Air Quality" },
  { name: "WIFIMG11187654321", rssi: -78, kind: "MG111 WiFi Air Quality" },
];

function RssiIcon({ rssi }: { rssi: number }) {
  if (rssi > -60) return <SignalHigh size={14} className="text-[#00cf78]" />;
  if (rssi > -75) return <SignalMedium size={14} className="text-[#fbbf24]" />;
  return <SignalLow size={14} className="text-[#f87171]" />;
}

export default function Scan() {
  const { go } = useApp();
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState<FoundDevice[]>([]);

  const startScan = () => {
    setFound([]);
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning) return;
    const timers: number[] = [];
    SCAN_RESULTS.forEach((d, i) => {
      timers.push(
        window.setTimeout(() => {
          setFound((prev) => (prev.some((p) => p.name === d.name) ? prev : [...prev, d]));
        }, 1100 + i * 900),
      );
    });
    timers.push(window.setTimeout(() => setScanning(false), 4200));
    return () => timers.forEach(clearTimeout);
  }, [scanning]);

  // auto-start on entry
  useEffect(() => {
    const t = window.setTimeout(startScan, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="eb-screen-in relative flex h-full flex-col bg-[#050810] px-6 pb-8 pt-14">
      <div className="flex items-center gap-3">
        <button
          onClick={() => go("splash")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1a2540] bg-[#0c1220] text-[#8fa39a]"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="text-[15px] font-bold text-[#e9f2ec]">Scan Devices</div>
          <div className="font-mono-eb text-[9px] uppercase tracking-[0.18em] text-[#8fa39a]">
            扫描设备 · Bluetooth LE
          </div>
        </div>
      </div>

      {/* radar */}
      <div className="relative mx-auto mt-8 h-52 w-52">
        <div className="absolute inset-0 rounded-full border border-[#1a2540]" />
        <div className="absolute inset-[18%] rounded-full border border-[#1a2540]" />
        <div className="absolute inset-[36%] rounded-full border border-[#1a2540]" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#1a2540]/60" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-[#1a2540]/60" />
        {scanning && (
          <div
            className="eb-radar-sweep absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(0,207,120,0.5), rgba(0,207,120,0.06) 18%, transparent 26%)",
            }}
          />
        )}
        <div className="absolute inset-[44%] rounded-full border border-[#00cf78]/50 bg-[#050810]">
          <div className="absolute inset-0 flex items-center justify-center">
            <Bluetooth size={15} className={scanning ? "text-[#00cf78]" : "text-[#8fa39a]"} />
          </div>
        </div>
        {/* blips */}
        {found.map((d, i) => (
          <div
            key={d.name}
            className="eb-radar-blip absolute h-2.5 w-2.5 rounded-full bg-[#00cf78]"
            style={{
              top: i === 0 ? "26%" : "68%",
              left: i === 0 ? "64%" : "28%",
              boxShadow: "0 0 10px #00cf78",
              animationDelay: `${i * 0.9}s`,
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <SectionLabel>{scanning ? "Scanning…" : `${found.length} device(s) found`}</SectionLabel>
        <button
          onClick={startScan}
          className="flex items-center gap-1.5 rounded-lg border border-[#1a2540] bg-[#0c1220] px-2.5 py-1.5 text-[10.5px] font-medium text-[#ceeec6]"
        >
          <RefreshCw size={11} className={scanning ? "eb-spin" : ""} />
          开始扫描
        </button>
      </div>

      <div className="mt-3 flex-1 space-y-2.5 overflow-y-auto eb-scroll">
        {found.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#1a2540] px-4 py-8 text-center">
            <div className="font-mono-eb text-[10px] uppercase tracking-[0.18em] text-[#8fa39a]">
              {scanning ? "Listening for WIFIMG111xxxxxxxx beacons" : "No devices yet — tap 开始扫描"}
            </div>
          </div>
        )}
        {found.map((d, i) => (
          <button
            key={d.name}
            onClick={() => go("password")}
            className="eb-fade-up group flex w-full items-center gap-3 rounded-2xl border border-[#1a2540] bg-[#0c1220] p-4 text-left transition-colors hover:border-[#00cf78]/50"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#00cf78]/30 bg-[#00cf78]/10">
              <Bluetooth size={18} className="text-[#00cf78]" />
              <span className="eb-ring-ping absolute inset-0 rounded-xl border border-[#00cf78]/40" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono-eb truncate text-[12.5px] font-semibold tracking-wide text-[#e9f2ec]">
                {d.name}
              </div>
              <div className="font-mono-eb mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[#8fa39a]">
                {d.kind}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <RssiIcon rssi={d.rssi} />
              <span className="font-mono-eb text-[9px] text-[#8fa39a]">{d.rssi} dBm</span>
            </div>
          </button>
        ))}
      </div>

      <div className="font-mono-eb mt-3 rounded-xl border border-[#1a2540] bg-[#0c1220] px-3.5 py-2.5 text-[9px] leading-relaxed tracking-[0.08em] text-[#8fa39a]">
        NOTE · Device broadcasts as <span className="text-[#ceeec6]">WIFIMG111 + 8-digit address</span>.
        E.g. address 12345678 → <span className="text-[#ceeec6]">WIFIMG11112345678</span>
      </div>
    </div>
  );
}
