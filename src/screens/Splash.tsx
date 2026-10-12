import { Bluetooth, Wifi, RadioTower, ChevronRight, Usb, Nfc } from "lucide-react";
import { useApp } from "@/state/app";
import { DEVICE_MODEL } from "@/data/device";
import { SectionLabel } from "@/components/widgets";
import logoWhite from "@/assets/ecobay-white.png";

const FEATURES = [
  { icon: Bluetooth, en: "BLE Config", cn: "蓝牙配置" },
  { icon: Wifi, en: "WiFi Provisioning", cn: "WIFI设置" },
  { icon: RadioTower, en: "Cloud Uplink", cn: "云平台接入" },
  { icon: Nfc, en: "Tap-to-Pair", cn: "碰一碰" },
  { icon: Usb, en: "USB Setup", cn: "USB免驱配置" },
];

export default function Splash() {
  const { go } = useApp();

  return (
    <div className="eb-screen-in relative flex h-full flex-col bg-[#050810] px-6 pb-8 pt-14">
      {/* halo */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,207,120,0.16), transparent 65%)" }}
      />

      <div className="eb-fade-up" style={{ animationDelay: "0.05s" }}>
        <img src={logoWhite} alt="ECOBAY" className="w-40" />
      </div>

      <div className="mt-10 eb-fade-up" style={{ animationDelay: "0.15s" }}>
        <SectionLabel>Air Command Console</SectionLabel>
        <h1 className="mt-3 text-[30px] font-bold leading-[1.12] tracking-tight text-[#e9f2ec]">
          Breathe data.
          <br />
          <span className="text-[#00cf78]">Command clean air.</span>
        </h1>
        <p className="mt-3 text-[12.5px] leading-relaxed text-[#8fa39a]">
          Configure, provision and monitor your {DEVICE_MODEL} multifunction air quality
          transmitter — 11 elements, one console.
        </p>
      </div>

      {/* device chip */}
      <div
        className="eb-fade-up mt-7 rounded-2xl border border-[#1a2540] bg-[#0c1220] p-4"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono-eb text-[9px] uppercase tracking-[0.2em] text-[#8fa39a]">
              Target device
            </div>
            <div className="font-mono-eb mt-1 text-[13px] font-semibold tracking-wide text-[#ceeec6]">
              {DEVICE_MODEL}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00cf78]/30 bg-[#00cf78]/10">
            <RadioTower size={19} className="text-[#00cf78]" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["PM2.5", "PM10", "CO₂", "HCHO", "TVOC", "O₂", "CO", "T/RH", "kPa", "dB", "+1"].map(
            (t) => (
              <span
                key={t}
                className="font-mono-eb rounded-md border border-[#1a2540] bg-[#111a2b] px-1.5 py-0.5 text-[9px] tracking-wider text-[#8fa39a]"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 eb-fade-up" style={{ animationDelay: "0.35s" }}>
        {FEATURES.map((f) => (
          <div key={f.en} className="flex items-center gap-2">
            <f.icon size={13} className="text-[#00cf78]" />
            <div>
              <span className="text-[10.5px] font-medium text-[#e9f2ec]">{f.en}</span>
              <span className="ml-1.5 text-[10px] text-[#8fa39a]">{f.cn}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <button
        onClick={() => go("scan")}
        className="eb-fade-up group flex w-full items-center justify-between rounded-2xl bg-[#00cf78] px-5 py-4 text-left transition-transform active:scale-[0.98]"
        style={{ animationDelay: "0.45s" }}
      >
        <div>
          <div className="text-[15px] font-bold text-[#04120b]">Connect Device</div>
          <div className="font-mono-eb text-[9px] uppercase tracking-[0.18em] text-[#04120b]/70">
            连接设备 · BLE scan
          </div>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04120b]/15 transition-transform group-active:translate-x-1">
          <ChevronRight size={18} className="text-[#04120b]" />
        </span>
      </button>

      <div className="font-mono-eb mt-4 text-center text-[8.5px] uppercase tracking-[0.24em] text-[#8fa39a]/60">
        Ver 2.0 · EcoBay Air Command
      </div>
    </div>
  );
}
