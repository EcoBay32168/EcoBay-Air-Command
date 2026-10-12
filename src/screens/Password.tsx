import { useState } from "react";
import { ArrowLeft, Bluetooth, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useApp } from "@/state/app";
import { DEVICE_BLE_NAME, DEVICE_DEFAULT_PASSWORD } from "@/data/device";
import { Spinner } from "@/components/widgets";

export default function Password() {
  const { go, connect, connecting, pushToast } = useApp();
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const submit = () => {
    if (connecting) return;
    if (pwd !== DEVICE_DEFAULT_PASSWORD) {
      setError(true);
      pushToast({
        title: "密码与设备匹配不一致",
        sub: "Password mismatch — check the device password",
        kind: "err",
      });
      return;
    }
    setError(false);
    connect();
  };

  return (
    <div className="eb-screen-in relative flex h-full flex-col bg-[#050810] px-6 pb-8 pt-14">
      <div className="flex items-center gap-3">
        <button
          onClick={() => go("scan")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1a2540] bg-[#0c1220] text-[#8fa39a]"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="text-[15px] font-bold text-[#e9f2ec]">Device Password</div>
          <div className="font-mono-eb text-[9px] uppercase tracking-[0.18em] text-[#8fa39a]">
            输入密码 · Pairing
          </div>
        </div>
      </div>

      {/* target device */}
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#1a2540] bg-[#0c1220] p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00cf78]/30 bg-[#00cf78]/10">
          <Bluetooth size={18} className="text-[#00cf78]" />
        </div>
        <div className="min-w-0">
          <div className="font-mono-eb truncate text-[13px] font-semibold tracking-wide text-[#e9f2ec]">
            {DEVICE_BLE_NAME}
          </div>
          <div className="font-mono-eb mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[#8fa39a]">
            Awaiting password · 等待密码
          </div>
        </div>
      </div>

      <div className="mt-7">
        <label className="font-mono-eb text-[9px] uppercase tracking-[0.22em] text-[#8fa39a]">
          设备密码 · Device password
        </label>
        <div
          className={`mt-2 flex items-center gap-2 rounded-2xl border bg-[#0c1220] px-4 transition-colors ${
            error ? "border-[#f87171]/60" : "border-[#1a2540] focus-within:border-[#00cf78]/60"
          }`}
        >
          <KeyRound size={15} className={error ? "text-[#f87171]" : "text-[#00cf78]"} />
          <input
            type={show ? "text" : "password"}
            value={pwd}
            maxLength={8}
            inputMode="numeric"
            autoFocus
            onChange={(e) => {
              setPwd(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Default 12345678"
            className="font-mono-eb w-full bg-transparent py-3.5 text-[15px] tracking-[0.3em] text-[#e9f2ec] outline-none placeholder:text-[#8fa39a]/40 placeholder:tracking-normal"
          />
          <button onClick={() => setShow(!show)} className="text-[#8fa39a]">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <div className="font-mono-eb mt-2 flex items-center gap-1.5 text-[9px] tracking-[0.1em] text-[#8fa39a]">
          <Lock size={10} />
          默认密码 12345678 · max 8 characters
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={submit}
        disabled={connecting || pwd.length === 0}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#00cf78] py-4 text-[15px] font-bold text-[#04120b] transition-all active:scale-[0.98] disabled:opacity-40"
      >
        {connecting ? (
          <>
            <Spinner size={15} color="#04120b" />
            Connecting… 正在连接设备
          </>
        ) : (
          "Connect · 连接"
        )}
      </button>
    </div>
  );
}
