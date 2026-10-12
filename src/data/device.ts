/**
 * SN-3001-MG111-WIFI — Multifunction Air Quality Transmitter (WiFi type)
 * All ranges / units / resolutions / node mappings are taken from the
 * product manual (Ver 2.0) §1.3 and the appendix "平台节点配置".
 */

export interface ElementSpec {
  id: string;
  en: string;
  cn: string;
  unit: string;
  range: [number, number];
  rangeLabel: string;
  resolution: number;
  node: number;
  channel: "A1" | "A2" | "U32";
  channelLabel: string;
  coeff: number;
  decimals: number;
  /** simulation */
  base: number;
  jitter: number;
  /** value considered "good" below this (or a band for O2/temp) */
  goodMax?: number;
  warnMax?: number;
  goodBand?: [number, number];
}

/** The 11 elements integrated in this MG111 unit */
export const ELEMENTS: ElementSpec[] = [
  {
    id: "pm25", en: "PM2.5", cn: "细颗粒物", unit: "μg/m³",
    range: [0, 1000], rangeLabel: "0~1000 μg/m³", resolution: 1,
    node: 1, channel: "A2", channelLabel: "模拟量2", coeff: 1,
    decimals: 0, base: 21, jitter: 14, goodMax: 35, warnMax: 75,
  },
  {
    id: "pm10", en: "PM10", cn: "可吸入颗粒物", unit: "μg/m³",
    range: [0, 1000], rangeLabel: "0~1000 μg/m³", resolution: 1,
    node: 1, channel: "A1", channelLabel: "模拟量1", coeff: 1,
    decimals: 0, base: 32, jitter: 18, goodMax: 50, warnMax: 150,
  },
  {
    id: "temp", en: "Temperature", cn: "温度", unit: "℃",
    range: [-40, 120], rangeLabel: "-40~+120 ℃", resolution: 0.1,
    node: 2, channel: "A1", channelLabel: "模拟量1", coeff: 0.1,
    decimals: 1, base: 23.6, jitter: 1.1, goodBand: [18, 27],
  },
  {
    id: "rh", en: "Humidity", cn: "湿度", unit: "%RH",
    range: [0, 100], rangeLabel: "0~100 %RH", resolution: 0.1,
    node: 2, channel: "A2", channelLabel: "模拟量2", coeff: 0.1,
    decimals: 1, base: 46.5, jitter: 3.5, goodBand: [30, 70],
  },
  {
    id: "co2", en: "CO₂", cn: "二氧化碳", unit: "ppm",
    range: [0, 5000], rangeLabel: "0~5000 ppm", resolution: 1,
    node: 6, channel: "A1", channelLabel: "模拟量1", coeff: 1,
    decimals: 0, base: 545, jitter: 95, goodMax: 800, warnMax: 1500,
  },
  {
    id: "hcho", en: "HCHO", cn: "甲醛", unit: "ppm",
    range: [0, 5], rangeLabel: "0~5 ppm", resolution: 0.01,
    node: 7, channel: "A1", channelLabel: "模拟量1", coeff: 0.01,
    decimals: 2, base: 0.03, jitter: 0.018, goodMax: 0.08, warnMax: 0.3,
  },
  {
    id: "tvoc", en: "TVOC", cn: "总挥发性有机物", unit: "ppb",
    range: [0, 60000], rangeLabel: "0~60000 ppb", resolution: 1,
    node: 5, channel: "A2", channelLabel: "模拟量2", coeff: 1,
    decimals: 0, base: 215, jitter: 70, goodMax: 400, warnMax: 2000,
  },
  {
    id: "o2", en: "O₂", cn: "氧气", unit: "%VOL",
    range: [0, 30], rangeLabel: "0~30 %VOL", resolution: 0.1,
    node: 9, channel: "A1", channelLabel: "模拟量1", coeff: 0.1,
    decimals: 1, base: 20.8, jitter: 0.15, goodBand: [19.5, 23],
  },
  {
    id: "co", en: "CO", cn: "一氧化碳", unit: "ppm",
    range: [0, 1000], rangeLabel: "0~1000 ppm", resolution: 1,
    node: 12, channel: "A1", channelLabel: "模拟量1", coeff: 1,
    decimals: 0, base: 3, jitter: 2.4, goodMax: 9, warnMax: 35,
  },
  {
    id: "pressure", en: "Pressure", cn: "大气压力", unit: "kPa",
    range: [0, 120], rangeLabel: "0~120 kPa", resolution: 0.1,
    node: 3, channel: "A1", channelLabel: "模拟量1", coeff: 0.1,
    decimals: 1, base: 101.2, jitter: 0.35,
  },
  {
    id: "noise", en: "Noise", cn: "噪声", unit: "dB",
    range: [30, 130], rangeLabel: "30~130 dB", resolution: 0.1,
    node: 17, channel: "A1", channelLabel: "模拟量1", coeff: 0.1,
    decimals: 1, base: 42, jitter: 9, goodMax: 55, warnMax: 70,
  },
];

/** Full platform node dictionary — manual appendix (平台节点配置) */
export interface NodeRow {
  node: number | string;
  en: string;
  cn: string;
  dataType: string;
  coeff: number;
  unit: string;
  range: string;
  active: boolean;
}

export const NODE_DICTIONARY: NodeRow[] = [
  { node: 1, en: "PM10", cn: "PM10", dataType: "模拟量1启用 / 模拟量2启用", coeff: 1, unit: "μg/m³", range: "0~1000", active: true },
  { node: 1, en: "PM2.5", cn: "PM2.5", dataType: "模拟量1启用 / 模拟量2启用", coeff: 1, unit: "μg/m³", range: "0~1000", active: true },
  { node: 2, en: "Temperature", cn: "温度", dataType: "模拟量1启用 / 模拟量2启用", coeff: 0.1, unit: "℃", range: "-40~120", active: true },
  { node: 2, en: "Humidity", cn: "湿度", dataType: "模拟量1启用 / 模拟量2启用", coeff: 0.1, unit: "%RH", range: "0~100", active: true },
  { node: 3, en: "Pressure", cn: "大气压力", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.1, unit: "kPa", range: "0~120", active: true },
  { node: 4, en: "Illuminance", cn: "光照", dataType: "32位无符号整形", coeff: 1, unit: "Lux", range: "0~200000", active: false },
  { node: 5, en: "TVOC", cn: "TVOC", dataType: "模拟量1禁用 / 模拟量2启用", coeff: 1, unit: "ppb", range: "0~60000", active: true },
  { node: 6, en: "CO₂", cn: "二氧化碳", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 1, unit: "ppm", range: "0~5000", active: true },
  { node: 7, en: "HCHO", cn: "甲醛", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.01, unit: "ppm", range: "0~5", active: true },
  { node: 8, en: "O₃", cn: "臭氧", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.01, unit: "ppm", range: "0~10", active: false },
  { node: 9, en: "O₂", cn: "氧气", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.1, unit: "%VOL", range: "0~30", active: true },
  { node: 10, en: "H₂S", cn: "硫化氢", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 1, unit: "ppm", range: "0~100", active: false },
  { node: 12, en: "CO", cn: "一氧化碳", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 1, unit: "ppm", range: "0~1000", active: true },
  { node: 13, en: "NO₂", cn: "二氧化氮", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.1, unit: "ppm", range: "0~20", active: false },
  { node: 14, en: "SO₂", cn: "二氧化硫", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.1, unit: "ppm", range: "0~20", active: false },
  { node: 15, en: "H₂", cn: "氢气", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 1, unit: "ppm", range: "0~1000", active: false },
  { node: 16, en: "NH₃", cn: "氨气", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 1, unit: "ppm", range: "0~100", active: false },
  { node: 17, en: "Noise", cn: "噪声", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.1, unit: "dB", range: "30~130", active: true },
  { node: 18, en: "Odor", cn: "异味", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 0.001, unit: "ppm", range: "0~5", active: false },
  { node: 19, en: "TSP", cn: "总悬浮颗粒物", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 1, unit: "μg/m³", range: "0~20000", active: false },
  { node: 20, en: "Smoke", cn: "烟雾", dataType: "模拟量1启用 / 模拟量2禁用", coeff: 1, unit: "ppm", range: "0~10000", active: false },
];

/** Basic device parameters — manual ch.3 蓝牙配置 (设备字典及实时数据选项说明) */
export interface DeviceParams {
  wifiSsid: string;      // WIFI名称：现场需连接的WIFI名称
  wifiPassword: string;  // WIFI密码：现场需连接的WIFI密码
  gprsUrl: string;       // GPRS目标地址URL：设备上传的目标地址
  gprsPort: string;      // GPRS目标端口：设备上传的目标端口
  addressCode: string;   // 设备网络8位地址码：仅查看，不可修改
}

export const DEVICE_MODEL = "SN-3001-MG111-WIFI";
export const DEVICE_ADDRESS = "12345678";
export const DEVICE_BLE_NAME = `WIFIMG111${DEVICE_ADDRESS}`;
export const DEVICE_DEFAULT_PASSWORD = "12345678";

/** values the connected device currently holds (returned by 召唤参数) */
export const DEVICE_STORED_PARAMS: DeviceParams = {
  wifiSsid: "EcoBay-Cleanroom-5G",
  wifiPassword: "ecobay2026",
  gprsUrl: "cloud.ecobay.com",
  gprsPort: "8020",
  addressCode: DEVICE_ADDRESS,
};

export type WifiLinkState = "wifi_server" | "wifi_only" | "offline";

export const WIFI_STATE_TEXT: Record<WifiLinkState, { en: string; cn: string }> = {
  wifi_server: { en: "WiFi connected · Server connected", cn: "已连接WIFI，已连接服务器" },
  wifi_only: { en: "WiFi connected · Server unreachable", cn: "已连接WIFI，未连接服务器" },
  offline: { en: "WiFi not connected", cn: "未连接WIFI，未连接服务器" },
};

export function elementStatus(el: ElementSpec, v: number): "good" | "warn" | "bad" {
  if (el.goodBand) {
    const [lo, hi] = el.goodBand;
    if (v >= lo && v <= hi) return "good";
    const span = hi - lo;
    if (v >= lo - span * 0.5 && v <= hi + span * 0.5) return "warn";
    return "bad";
  }
  if (el.goodMax !== undefined) {
    if (v <= el.goodMax) return "good";
    if (el.warnMax !== undefined && v <= el.warnMax) return "warn";
    return "bad";
  }
  return "good";
}
