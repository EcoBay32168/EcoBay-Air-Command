import { useMemo, useState } from "react";
import {
  Activity,
  Bluetooth,
  Download,
  Eye,
  EyeOff,
  Globe,
  Hash,
  ListTree,
  Lock,
  Power,
  RefreshCw,
  Server,
  Settings2,
  Upload,
  Wifi,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp, type DeviceTab } from "@/state/app";
import {
  DEVICE_BLE_NAME,
  DEVICE_MODEL,
  ELEMENTS,
  NODE_DICTIONARY,
  elementStatus,
  type ElementSpec,
} from "@/data/device";
import { Gauge, Led, RangeBar, SectionLabel, Sparkline, Spinner } from "@/components/widgets";
import logoWhite from "@/assets/ecobay-white.png";

const STATUS_COLOR = { good: "#00cf78", warn: "#fbbf24", bad: "#f87171" } as const;

/* ================= header ================= */
function DeviceHeader() {
  const { wifiStateText, wifiState } = useApp();
  return (
    <div className="border-b border-[#1a2540] bg-[#0c1220]/80 px-5 pb-3 pt-12 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <img src={logoWhite} alt="ECOBAY" className="w-24" />
        <div className="flex items-center gap-3">
          <Led color="#00cf78" pulse label="BLE" />
          <Led color={wifiState === "offline" ? "#f87171" : "#00cf78"} pulse label="WiFi" />
          <Led color={wifiState === "wifi_server" ? "#00cf78" : "#fbbf24"} label="SRV" />
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <div>
          <div className="font-mono-eb text-[11px] font-semibold tracking-wider text-[#ceeec6]">
            {DEVICE_BLE_NAME}
          </div>
          <div className="font-mono-eb mt-0.5 text-[8.5px] uppercase tracking-[0.16em] text-[#8fa39a]">
            {DEVICE_MODEL}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-medium text-[#e9f2ec]">{wifiStateText.en}</div>
          <div className="font-mono-eb text-[8.5px] tracking-[0.1em] text-[#8fa39a]">
            {wifiStateText.cn}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= monitor tab ================= */
function aqiScore(latest: Record<string, number>): { score: number; label: string; color: string } {
  const pm = latest["pm25"] ?? 0;
  const co2 = latest["co2"] ?? 0;
  const hcho = latest["hcho"] ?? 0;
  const tvoc = latest["tvoc"] ?? 0;
  // simple composite 0-100 (100 = pristine)
  const sPm = Math.max(0, 1 - pm / 150);
  const sCo2 = Math.max(0, 1 - Math.max(0, co2 - 400) / 1600);
  const sHcho = Math.max(0, 1 - hcho / 0.3);
  const sTvoc = Math.max(0, 1 - tvoc / 3000);
  const score = Math.round(((sPm + sCo2 + sHcho + sTvoc) / 4) * 100);
  if (score >= 80) return { score, label: "EXCELLENT", color: "#00cf78" };
  if (score >= 60) return { score, label: "GOOD", color: "#22d3ee" };
  if (score >= 40) return { score, label: "MODERATE", color: "#fbbf24" };
  return { score, label: "POOR", color: "#f87171" };
}

function SensorCard({ el }: { el: ElementSpec }) {
  const { latest, readings, selectedElement, setSelectedElement } = useApp();
  const v = latest[el.id];
  const status = v === undefined ? "good" : elementStatus(el, v);
  const color = STATUS_COLOR[status];
  const selected = selectedElement === el.id;
  const series = useMemo(() => readings.map((r) => r.values[el.id] ?? 0), [readings, el.id]);

  return (
    <button
      onClick={() => setSelectedElement(el.id)}
      className={`rounded-2xl border p-3 text-left transition-all ${
        selected
          ? "border-[#00cf78]/60 bg-[#111a2b]"
          : "border-[#1a2540] bg-[#0c1220] hover:border-[#1a2540]/0 hover:bg-[#111a2b]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold text-[#e9f2ec]">{el.en}</div>
          <div className="truncate text-[9px] text-[#8fa39a]">{el.cn}</div>
        </div>
        <span
          className="h-[7px] w-[7px] shrink-0 rounded-full"
          style={{ background: color, boxShadow: `0 0 7px ${color}` }}
        />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-mono-eb text-[21px] font-semibold leading-none tracking-tight text-[#e9f2ec]">
          {v === undefined ? "--" : v.toFixed(el.decimals)}
        </span>
        <span className="font-mono-eb text-[9px] text-[#8fa39a]">{el.unit}</span>
      </div>
      <div className="mt-1.5">
        <Sparkline data={series} color={color} height={30} />
      </div>
      <div className="mt-1.5">
        <RangeBar value={v ?? 0} range={el.range} status={status} />
        <div className="font-mono-eb mt-1 flex justify-between text-[7.5px] tracking-wider text-[#8fa39a]/70">
          <span>{el.range[0]}</span>
          <span>{el.rangeLabel}</span>
          <span>{el.range[1]}</span>
        </div>
      </div>
    </button>
  );
}

function TrendChart({ el }: { el: ElementSpec }) {
  const { readings } = useApp();
  const data = useMemo(
    () =>
      readings.map((r) => ({
        t: new Date(r.t).toLocaleTimeString("en-GB", { hour12: false }),
        v: r.values[el.id] ?? 0,
      })),
    [readings, el.id],
  );
  return (
    <div className="rounded-2xl border border-[#1a2540] bg-[#0c1220] p-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[12px] font-semibold text-[#e9f2ec]">{el.en}</span>
          <span className="ml-2 text-[10px] text-[#8fa39a]">{el.cn}</span>
        </div>
        <span className="font-mono-eb text-[9px] uppercase tracking-[0.16em] text-[#8fa39a]">
          Node {el.node} · {el.channelLabel} · ×{el.coeff}
        </span>
      </div>
      <div className="mt-3 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="ebGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00cf78" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#00cf78" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1a2540" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: "#8fa39a", fontSize: 8, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={{ stroke: "#1a2540" }}
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: "#8fa39a", fontSize: 8, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#0c1220",
                border: "1px solid #1a2540",
                borderRadius: 10,
                fontSize: 11,
                fontFamily: "JetBrains Mono",
              }}
              labelStyle={{ color: "#8fa39a", fontSize: 9 }}
              formatter={(val) => [`${val} ${el.unit}`, el.en]}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#00cf78"
              strokeWidth={1.8}
              fill="url(#ebGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="font-mono-eb mt-2 flex justify-between text-[8.5px] tracking-[0.12em] text-[#8fa39a]">
        <span>RANGE {el.rangeLabel}</span>
        <span>RES {el.resolution}
          {" "}{el.unit}
        </span>
      </div>
    </div>
  );
}

function MonitorTab() {
  const { latest, fetchLive, fetchingLive, selectedElement } = useApp();
  const aqi = aqiScore(latest);
  const selected = ELEMENTS.find((e) => e.id === selectedElement) ?? ELEMENTS[0];

  return (
    <div className="space-y-4 px-5 py-4">
      {/* AQI hero */}
      <div className="flex items-center gap-5 rounded-2xl border border-[#1a2540] bg-[#0c1220] p-4">
        <Gauge pct={aqi.score / 100} color={aqi.color} size={132} stroke={9}>
          <div className="font-mono-eb text-[30px] font-bold leading-none text-[#e9f2ec]">
            {aqi.score}
          </div>
          <div className="font-mono-eb mt-1 text-[8px] uppercase tracking-[0.24em] text-[#8fa39a]">
            Air Score
          </div>
        </Gauge>
        <div className="min-w-0 flex-1">
          <div
            className="font-mono-eb inline-block rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.2em]"
            style={{ color: aqi.color, background: aqi.color + "1a", border: `1px solid ${aqi.color}44` }}
          >
            {aqi.label}
          </div>
          <div className="mt-2.5 space-y-1.5">
            {[
              { k: "PM2.5", v: latest["pm25"], u: "μg/m³" },
              { k: "CO₂", v: latest["co2"], u: "ppm" },
              { k: "HCHO", v: latest["hcho"], u: "ppm" },
            ].map((r) => (
              <div key={r.k} className="flex items-baseline justify-between">
                <span className="font-mono-eb text-[9px] tracking-[0.14em] text-[#8fa39a]">{r.k}</span>
                <span className="font-mono-eb text-[11px] font-medium text-[#e9f2ec]">
                  {r.v ?? "--"}
                  <span className="ml-1 text-[8px] text-[#8fa39a]">{r.u}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <SectionLabel>Live elements · 实时数据</SectionLabel>
        <button
          onClick={fetchLive}
          className="flex items-center gap-1.5 rounded-lg border border-[#00cf78]/40 bg-[#00cf78]/10 px-2.5 py-1.5 text-[10.5px] font-semibold text-[#00cf78]"
        >
          {fetchingLive ? <Spinner size={11} /> : <RefreshCw size={11} />}
          召唤实时数据
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {ELEMENTS.map((el) => (
          <SensorCard key={el.id} el={el} />
        ))}
      </div>

      <TrendChart el={selected} />
    </div>
  );
}

/* ================= config tab ================= */
function Field({
  icon: Icon,
  label,
  cn,
  value,
  onChange,
  readOnly = false,
  secret = false,
  mono = true,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  cn: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  secret?: boolean;
  mono?: boolean;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="font-mono-eb text-[9px] uppercase tracking-[0.2em] text-[#8fa39a]">
          {label}
        </label>
        <span className="text-[9px] text-[#8fa39a]/80">{cn}</span>
      </div>
      <div
        className={`mt-1.5 flex items-center gap-2.5 rounded-xl border px-3.5 transition-colors ${
          readOnly
            ? "border-[#1a2540]/70 bg-[#0c1220]/50"
            : "border-[#1a2540] bg-[#0c1220] focus-within:border-[#00cf78]/60"
        }`}
      >
        <Icon size={14} className={readOnly ? "text-[#8fa39a]/60" : "text-[#00cf78]"} />
        <input
          value={value}
          readOnly={readOnly}
          type={secret && !show ? "password" : "text"}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={readOnly ? "" : "— 召唤参数后读取 —"}
          className={`w-full bg-transparent py-3 text-[13px] text-[#e9f2ec] outline-none placeholder:text-[#8fa39a]/40 ${
            mono ? "font-mono-eb tracking-wider" : ""
          } ${readOnly ? "text-[#8fa39a]" : ""}`}
        />
        {secret && !readOnly && (
          <button onClick={() => setShow(!show)} className="text-[#8fa39a]">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
        {readOnly && <Lock size={12} className="text-[#8fa39a]/60" />}
      </div>
      {hint && (
        <div className="font-mono-eb mt-1 text-[8.5px] tracking-[0.08em] text-[#8fa39a]/70">{hint}</div>
      )}
    </div>
  );
}

function ConfigTab() {
  const {
    params,
    setParam,
    fetchParams,
    sendParams,
    fetchingParams,
    sendingParams,
    paramsLoaded,
    wifiStateText,
  } = useApp();

  return (
    <div className="space-y-4 px-5 py-4">
      {/* link status */}
      <div className="rounded-2xl border border-[#1a2540] bg-[#0c1220] p-4">
        <SectionLabel>Link status · 连接状态</SectionLabel>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: Bluetooth, t: "BLE", s: "Connected", ok: true },
            { icon: Wifi, t: "WiFi", s: "Connected", ok: true },
            { icon: Server, t: "Server", s: wifiStateText.en.includes("Server connected") ? "Connected" : "Standby", ok: wifiStateText.en.includes("Server connected") },
          ].map((x) => (
            <div
              key={x.t}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[#1a2540] bg-[#111a2b] py-3"
            >
              <x.icon size={15} className={x.ok ? "text-[#00cf78]" : "text-[#fbbf24]"} />
              <span className="font-mono-eb text-[9px] font-bold tracking-[0.18em] text-[#e9f2ec]">
                {x.t}
              </span>
              <span className="font-mono-eb text-[8px] tracking-[0.1em] text-[#8fa39a]">{x.s}</span>
            </div>
          ))}
        </div>
        <div className="font-mono-eb mt-3 rounded-lg bg-[#111a2b] px-3 py-2 text-center text-[9px] tracking-[0.12em] text-[#ceeec6]">
          {wifiStateText.cn}
        </div>
      </div>

      {/* basic params */}
      <div className="rounded-2xl border border-[#1a2540] bg-[#0c1220] p-4">
        <div className="flex items-center justify-between">
          <SectionLabel>Basic parameters · 基础参数配置</SectionLabel>
          {paramsLoaded && (
            <span className="font-mono-eb rounded bg-[#00cf78]/10 px-1.5 py-0.5 text-[8px] tracking-[0.14em] text-[#00cf78]">
              SYNCED
            </span>
          )}
        </div>
        <div className="mt-4 space-y-4">
          <Field
            icon={Wifi}
            label="WiFi Name / SSID"
            cn="WIFI名称"
            value={params.wifiSsid}
            onChange={(v) => setParam("wifiSsid", v)}
            hint="现场需连接的WIFI名称"
          />
          <Field
            icon={Lock}
            label="WiFi Password"
            cn="WIFI密码"
            value={params.wifiPassword}
            onChange={(v) => setParam("wifiPassword", v)}
            secret
            hint="现场需连接的WIFI密码"
          />
          <Field
            icon={Globe}
            label="GPRS Target URL"
            cn="GPRS目标地址URL"
            value={params.gprsUrl}
            onChange={(v) => setParam("gprsUrl", v)}
            hint="设备上传的目标地址"
          />
          <Field
            icon={Hash}
            label="GPRS Target Port"
            cn="GPRS目标端口"
            value={params.gprsPort}
            onChange={(v) => setParam("gprsPort", v.replace(/[^0-9]/g, ""))}
            hint="设备上传的目标端口"
          />
          <Field
            icon={Hash}
            label="Device Network Address (8-bit)"
            cn="设备网络8位地址码"
            value={params.addressCode}
            readOnly
            hint="仅查看，不可修改"
          />
        </div>
      </div>

      {/* actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={fetchParams}
          disabled={fetchingParams}
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#00cf78]/50 bg-[#00cf78]/10 py-3.5 text-[12.5px] font-bold text-[#00cf78] transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {fetchingParams ? <Spinner size={13} /> : <Download size={14} />}
          召唤参数
        </button>
        <button
          onClick={sendParams}
          disabled={sendingParams || !paramsLoaded}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#00cf78] py-3.5 text-[12.5px] font-bold text-[#04120b] transition-all active:scale-[0.98] disabled:opacity-40"
        >
          {sendingParams ? <Spinner size={13} color="#04120b" /> : <Upload size={14} />}
          下发参数
        </button>
      </div>
      <div className="font-mono-eb px-1 text-center text-[8.5px] leading-relaxed tracking-[0.1em] text-[#8fa39a]/80">
        点击召唤参数读取设备现有参数 · 更改参数后点击下发参数写入设备
      </div>
    </div>
  );
}

/* ================= nodes tab ================= */
function NodesTab() {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between">
        <SectionLabel>Node dictionary · 设备字典</SectionLabel>
        <span className="font-mono-eb text-[8.5px] tracking-[0.14em] text-[#8fa39a]">
          {NODE_DICTIONARY.filter((n) => n.active).length}/{NODE_DICTIONARY.length} ACTIVE
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#1a2540]">
        <div className="font-mono-eb grid grid-cols-[34px_1fr_64px_44px_70px] gap-x-2 border-b border-[#1a2540] bg-[#111a2b] px-3 py-2 text-[8px] uppercase tracking-[0.14em] text-[#8fa39a]">
          <span>Node</span>
          <span>Element</span>
          <span>Coeff</span>
          <span>Unit</span>
          <span className="text-right">Range</span>
        </div>
        <div className="eb-scroll max-h-[430px] overflow-y-auto bg-[#0c1220]">
          {NODE_DICTIONARY.map((n, i) => (
            <div
              key={`${n.node}-${n.en}-${i}`}
              className={`grid grid-cols-[34px_1fr_64px_44px_70px] items-center gap-x-2 border-b border-[#1a2540]/50 px-3 py-2.5 ${
                n.active ? "" : "opacity-35"
              }`}
            >
              <span
                className={`font-mono-eb flex h-5 w-6 items-center justify-center rounded text-[9px] font-bold ${
                  n.active ? "bg-[#00cf78]/15 text-[#00cf78]" : "bg-[#111a2b] text-[#8fa39a]"
                }`}
              >
                {n.node}
              </span>
              <div className="min-w-0">
                <div className="truncate text-[11px] font-medium text-[#e9f2ec]">
                  {n.en}
                  <span className="ml-1.5 text-[9px] text-[#8fa39a]">{n.cn}</span>
                </div>
                <div className="font-mono-eb truncate text-[7.5px] tracking-[0.06em] text-[#8fa39a]/70">
                  {n.dataType}
                </div>
              </div>
              <span className="font-mono-eb text-[9.5px] text-[#ceeec6]">×{n.coeff}</span>
              <span className="font-mono-eb truncate text-[9px] text-[#8fa39a]">{n.unit}</span>
              <span className="font-mono-eb text-right text-[9px] text-[#8fa39a]">{n.range}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="font-mono-eb mt-3 rounded-xl border border-[#1a2540] bg-[#0c1220] px-3.5 py-2.5 text-[8.5px] leading-relaxed tracking-[0.08em] text-[#8fa39a]">
        APPENDIX · 平台节点配置 — highlighted rows are the 11 elements integrated in this
        MG111 unit. 异味与CO₂不可同时选择 · TSP(高精度)独占要素。
      </div>
    </div>
  );
}

/* ================= device screen shell ================= */
const TABS: { id: DeviceTab; en: string; cn: string; icon: React.ElementType }[] = [
  { id: "monitor", en: "Monitor", cn: "实时数据", icon: Activity },
  { id: "config", en: "Config", cn: "参数配置", icon: Settings2 },
  { id: "nodes", en: "Nodes", cn: "设备字典", icon: ListTree },
];

export default function Device() {
  const { tab, setTab, go } = useApp();
  const [confirmOff, setConfirmOff] = useState(false);

  return (
    <div className="eb-screen-in relative flex h-full flex-col bg-[#050810]">
      <DeviceHeader />

      <div className="eb-scroll relative flex-1 overflow-y-auto">
        {tab === "monitor" && <MonitorTab />}
        {tab === "config" && <ConfigTab />}
        {tab === "nodes" && <NodesTab />}
      </div>

      {/* tab bar */}
      <div className="relative border-t border-[#1a2540] bg-[#0c1220]/90 px-4 pb-5 pt-2 backdrop-blur-md">
        <div className="flex items-center justify-between">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex flex-1 flex-col items-center gap-1 py-1.5"
              >
                <t.icon size={17} className={active ? "text-[#00cf78]" : "text-[#8fa39a]"} />
                <span
                  className={`text-[9px] font-medium ${active ? "text-[#00cf78]" : "text-[#8fa39a]"}`}
                >
                  {t.en} · {t.cn}
                </span>
                <span
                  className={`h-[3px] w-8 rounded-full transition-all ${
                    active ? "bg-[#00cf78]" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
          <button
            onClick={() => setConfirmOff(true)}
            className="flex flex-col items-center gap-1 px-2 py-1.5"
          >
            <Power size={17} className="text-[#f87171]/80" />
            <span className="text-[9px] font-medium text-[#f87171]/80">断开</span>
            <span className="h-[3px] w-8 rounded-full bg-transparent" />
          </button>
        </div>
      </div>

      {/* disconnect confirm */}
      {confirmOff && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="eb-fade-up w-full rounded-t-3xl border-t border-[#1a2540] bg-[#0c1220] p-6 pb-9">
            <div className="text-[15px] font-bold text-[#e9f2ec]">Disconnect device?</div>
            <div className="mt-1.5 text-[11.5px] leading-relaxed text-[#8fa39a]">
              连接断开，数据传输中断 · The BLE link and live data stream will stop.
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setConfirmOff(false)}
                className="rounded-xl border border-[#1a2540] bg-[#111a2b] py-3 text-[13px] font-semibold text-[#e9f2ec]"
              >
                Cancel
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-[#f87171] py-3 text-[13px] font-bold text-[#1a0505]"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
      {void go}
    </div>
  );
}
