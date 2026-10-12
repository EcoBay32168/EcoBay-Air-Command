import { useApp } from "@/state/app";
import { DEVICE_MODEL } from "@/data/device";
import { ToastStack } from "@/components/widgets";
import Splash from "@/screens/Splash";
import Scan from "@/screens/Scan";
import Password from "@/screens/Password";
import Device from "@/screens/Device";
import logoMint from "@/assets/ecobay-mint.png";
import logoWhite from "@/assets/ecobay-white.png";

function PhoneScreen() {
  const { screen } = useApp();
  return (
    <>
      {screen === "splash" && <Splash />}
      {screen === "scan" && <Scan />}
      {screen === "password" && <Password />}
      {screen === "device" && <Device />}
      <ToastStack />
    </>
  );
}

const TICKER_ITEMS = [
  "BLE LINK ESTABLISHED · WIFIMG11112345678",
  "参数已召唤成功 · PARAMETERS RECALLED",
  "WIFI已连接 · SERVER CONNECTED",
  "实时数据召唤成功 · LIVE DATA OK",
  "11 ELEMENTS ONLINE · 11要素在线",
  "GPRS UPLINK 8020 · NOMINAL",
];

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#050810]">
      {/* stage backdrop */}
      <div className="eb-stage-grid absolute inset-0" />
      <div
        className="pointer-events-none absolute -left-40 top-[-20%] h-[560px] w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,85,75,0.35), transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-[-30%] right-[-10%] h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,207,120,0.12), transparent 65%)" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:items-center lg:gap-16">
        {/* brand panel */}
        <div className="flex-1 px-7 pb-4 pt-10 lg:py-16 lg:pl-4">
          <img src={logoMint} alt="ECOBAY" className="w-52 lg:w-72" />

          <h1 className="mt-8 max-w-md text-[34px] font-bold leading-[1.08] tracking-tight text-[#e9f2ec] lg:text-[46px]">
            Air Command
            <span className="text-[#00cf78]">.</span>
            <br />
            <span className="text-[#8fa39a]">One console for every breath.</span>
          </h1>

          <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-[#8fa39a]">
            The redesigned companion for the{" "}
            <span className="font-mono-eb text-[#ceeec6]">{DEVICE_MODEL}</span> multifunction air
            quality transmitter — BLE pairing, WiFi provisioning, parameter recall &amp; dispatch,
            and a live 11-element monitoring deck.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#1a2540] bg-[#1a2540]">
            {[
              { k: "11", v: "Elements · 要素" },
              { k: "BLE 5", v: "Config link · 蓝牙" },
              { k: "WiFi", v: "Cloud uplink · 上传" },
            ].map((s) => (
              <div key={s.v} className="bg-[#0c1220] px-4 py-4">
                <div className="font-mono-eb text-[17px] font-bold text-[#00cf78]">{s.k}</div>
                <div className="mt-1 text-[9.5px] leading-snug text-[#8fa39a]">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="font-mono-eb mt-8 hidden items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-[#8fa39a]/70 lg:flex">
            <span className="eb-pulse-dot inline-block h-[7px] w-[7px] rounded-full bg-[#00cf78]" />
            Interactive prototype — drive the phone
          </div>
        </div>

        {/* phone */}
        <div className="relative flex flex-1 items-center justify-center px-6 pb-14 lg:py-16">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,207,120,0.1), transparent 60%)" }}
          />
          <div className="relative w-[min(400px,92vw)]">
            {/* frame */}
            <div className="rounded-[3.2rem] border border-[#1a2540] bg-[#0c1220] p-[10px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8),0_0_60px_-20px_rgba(0,207,120,0.25)]">
              <div className="eb-scanlines relative h-[min(800px,172vw)] overflow-hidden rounded-[2.6rem] bg-[#050810] lg:h-[780px]">
                {/* status bar */}
                <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-7 pt-3.5">
                  <span className="font-mono-eb text-[10px] font-semibold text-[#e9f2ec]">9:41</span>
                  <div className="h-[22px] w-[110px] rounded-full bg-black/80" />
                  <div className="flex items-center gap-1.5">
                    <span className="h-[8px] w-[11px] rounded-[2px] border border-[#e9f2ec]/70">
                      <span className="block h-full w-2/3 rounded-[1px] bg-[#00cf78]" />
                    </span>
                  </div>
                </div>
                <PhoneScreen />
              </div>
            </div>

            {/* side caption */}
            <div className="font-mono-eb mt-5 text-center text-[9px] uppercase tracking-[0.26em] text-[#8fa39a]/70">
              ECOBAY AIR COMMAND · SN-3001-MG111-WIFI
            </div>
          </div>
        </div>
      </div>

      {/* ticker */}
      <div className="relative border-t border-[#1a2540] bg-[#0c1220]/80 py-2.5 backdrop-blur-md">
        <div className="flex overflow-hidden">
          <div className="eb-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span
                key={i}
                className="font-mono-eb flex items-center gap-2.5 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] text-[#8fa39a]"
              >
                <span className="h-[5px] w-[5px] rounded-full bg-[#00cf78]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* hidden preloaded logo for header swap */}
      <img src={logoWhite} alt="" className="hidden" />
    </div>
  );
}
