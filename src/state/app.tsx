import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEVICE_STORED_PARAMS,
  ELEMENTS,
  WIFI_STATE_TEXT,
  type DeviceParams,
  type WifiLinkState,
} from "@/data/device";

export type Screen = "splash" | "scan" | "password" | "device";
export type DeviceTab = "monitor" | "config" | "nodes";

export interface Reading {
  t: number;
  values: Record<string, number>;
}

export interface Toast {
  id: number;
  title: string;
  sub?: string;
  kind: "ok" | "err" | "info";
}

interface AppState {
  screen: Screen;
  go: (s: Screen) => void;

  connected: boolean;
  connecting: boolean;
  connect: () => void;

  tab: DeviceTab;
  setTab: (t: DeviceTab) => void;

  params: DeviceParams;        // editable form values
  setParam: <K extends keyof DeviceParams>(k: K, v: DeviceParams[K]) => void;
  paramsLoaded: boolean;       // whether 召唤参数 has run
  fetchingParams: boolean;
  sendingParams: boolean;
  fetchParams: () => void;     // 召唤参数
  sendParams: () => void;      // 下发参数

  wifiState: WifiLinkState;
  fetchingLive: boolean;
  fetchLive: () => void;       // 召唤实时数据

  readings: Reading[];
  latest: Record<string, number>;
  selectedElement: string;
  setSelectedElement: (id: string) => void;

  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;

  wifiStateText: { en: string; cn: string };
}

const Ctx = createContext<AppState | null>(null);

let toastSeq = 1;

function jitterValues(prev: Record<string, number> | null): Record<string, number> {
  const out: Record<string, number> = {};
  for (const el of ELEMENTS) {
    const last = prev?.[el.id] ?? el.base;
    const drift = (Math.random() - 0.5) * 2 * el.jitter * 0.35;
    let v = last + drift + (el.base - last) * 0.12;
    const [lo, hi] = el.range;
    v = Math.min(hi, Math.max(lo, v));
    out[el.id] = Number(v.toFixed(el.decimals));
  }
  return out;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("splash");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [tab, setTab] = useState<DeviceTab>("monitor");

  const [params, setParams] = useState<DeviceParams>({
    wifiSsid: "",
    wifiPassword: "",
    gprsUrl: "",
    gprsPort: "",
    addressCode: DEVICE_STORED_PARAMS.addressCode,
  });
  const [paramsLoaded, setParamsLoaded] = useState(false);
  const [fetchingParams, setFetchingParams] = useState(false);
  const [sendingParams, setSendingParams] = useState(false);

  const [wifiState, setWifiState] = useState<WifiLinkState>("wifi_server");
  const [fetchingLive, setFetchingLive] = useState(false);

  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedElement, setSelectedElement] = useState("pm25");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<number[]>([]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = toastSeq++;
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
    timers.current.push(timer);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const go = useCallback((s: Screen) => setScreen(s), []);

  const connect = useCallback(() => {
    setConnecting(true);
    window.setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      setScreen("device");
      pushToast({ title: "设备连接成功", sub: "Device connected via BLE", kind: "ok" });
    }, 1600);
  }, [pushToast]);

  const fetchParams = useCallback(() => {
    if (fetchingParams) return;
    setFetchingParams(true);
    window.setTimeout(() => {
      setParams({ ...DEVICE_STORED_PARAMS });
      setParamsLoaded(true);
      setFetchingParams(false);
      setWifiState("wifi_server");
      pushToast({ title: "参数已召唤成功", sub: "Parameters recalled from device", kind: "ok" });
    }, 1400);
  }, [fetchingParams, pushToast]);

  const sendParams = useCallback(() => {
    if (sendingParams) return;
    setSendingParams(true);
    window.setTimeout(() => {
      setSendingParams(false);
      pushToast({ title: "参数下发成功", sub: "Parameters written to device", kind: "ok" });
    }, 1600);
  }, [sendingParams, pushToast]);

  const fetchLive = useCallback(() => {
    if (fetchingLive) return;
    setFetchingLive(true);
    window.setTimeout(() => {
      setFetchingLive(false);
      pushToast({ title: "实时数据召唤成功", sub: "Live data refreshed", kind: "ok" });
    }, 1200);
  }, [fetchingLive, pushToast]);

  // live data simulation — the stream "recalled" from the connected device
  useEffect(() => {
    if (!connected) return;
    const seed: Reading = { t: Date.now(), values: jitterValues(null) };
    setReadings((prev) => [...prev.slice(-59), seed]);
    const iv = window.setInterval(() => {
      setReadings((prev) => {
        const last = prev[prev.length - 1]?.values ?? null;
        const next: Reading = { t: Date.now(), values: jitterValues(last) };
        return [...prev.slice(-59), next];
      });
    }, 2000);
    return () => window.clearInterval(iv);
  }, [connected]);

  const latest = readings[readings.length - 1]?.values ?? {};

  const value: AppState = useMemo(
    () => ({
      screen,
      go,
      connected,
      connecting,
      connect,
      tab,
      setTab,
      params,
      setParam: (k, v) => setParams((p) => ({ ...p, [k]: v })),
      paramsLoaded,
      fetchingParams,
      sendingParams,
      fetchParams,
      sendParams,
      wifiState,
      fetchingLive,
      fetchLive,
      readings,
      latest,
      selectedElement,
      setSelectedElement,
      toasts,
      pushToast,
      dismissToast,
      wifiStateText: WIFI_STATE_TEXT[wifiState],
    }),
    [
      screen, go, connected, connecting, connect, tab, params, paramsLoaded,
      fetchingParams, sendingParams, fetchParams, sendParams, wifiState,
      fetchingLive, fetchLive, readings, latest, selectedElement, toasts,
      pushToast, dismissToast,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}
