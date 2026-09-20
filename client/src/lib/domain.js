export const APP_VERSION = "0.1.0";
export const SNAPSHOT_STORAGE_KEY = "playroom:local-snapshot";
export const STATE_STORAGE_KEY = "playroom:state";
export const SYNC_QUEUE_STORAGE_KEY = "playroom:sync-queue";

const minutesAgo = (minutes) => Date.now() - minutes * 60 * 1000;

export function createDefaultState() {
  return {
    systemConfig: {
      branchId: "PLAYROOM-RYD-01",
      currency: "SAR",
      powerCostPerKWh: 0.42,
      autoCaptureIntervalSec: 30,
      noShowGracePeriodMin: 15,
    },
    stations: [
      {
        id: "ps5-01",
        name: "NEON 01",
        type: "PS5",
        status: "ACTIVE",
        powerSpecs: { consoleWattage: 220, tvWattage: 110 },
        pricing: { singleRatePerHour: 28, multiRatePerHour: 36, vipRatePerHour: 52 },
        activeSession: {
          sessionId: "SES-7842",
          mode: "OPEN",
          controllerCount: 2,
          startTime: minutesAgo(73),
          endTime: null,
          paused: false,
          accumulatedPausedMs: 0,
          ordersTab: [{ itemId: "drink-01", name: "Energy Drink", qty: 2, price: 8 }],
          splitBill: [],
        },
        maintenance: { totalRunTimeHours: 342, nextThermalPasteDueHours: 158, nextDeepCleanDueHours: 18 },
      },
      {
        id: "ps5-02",
        name: "NEON 02",
        type: "PS5",
        status: "ACTIVE",
        powerSpecs: { consoleWattage: 220, tvWattage: 110 },
        pricing: { singleRatePerHour: 28, multiRatePerHour: 36, vipRatePerHour: 52 },
        activeSession: {
          sessionId: "SES-7848",
          mode: "FIXED",
          controllerCount: 4,
          startTime: minutesAgo(42),
          endTime: Date.now() + 48 * 60 * 1000,
          paused: false,
          accumulatedPausedMs: 0,
          ordersTab: [],
          splitBill: [],
        },
        maintenance: { totalRunTimeHours: 281, nextThermalPasteDueHours: 219, nextDeepCleanDueHours: 39 },
      },
      {
        id: "vip-01",
        name: "NEXUS VIP",
        type: "VIP",
        status: "RESERVED",
        powerSpecs: { consoleWattage: 280, tvWattage: 140 },
        pricing: { singleRatePerHour: 45, multiRatePerHour: 58, vipRatePerHour: 78 },
        activeSession: null,
        maintenance: { totalRunTimeHours: 524, nextThermalPasteDueHours: 76, nextDeepCleanDueHours: 6 },
      },
      {
        id: "rig-01",
        name: "RIG 01",
        type: "RIG",
        status: "IDLE",
        powerSpecs: { consoleWattage: 650, tvWattage: 0 },
        pricing: { singleRatePerHour: 34, multiRatePerHour: 44, vipRatePerHour: 60 },
        activeSession: null,
        maintenance: { totalRunTimeHours: 164, nextThermalPasteDueHours: 336, nextDeepCleanDueHours: 44 },
      },
      {
        id: "vr-01",
        name: "VR LAB",
        type: "VR",
        status: "MAINTENANCE",
        powerSpecs: { consoleWattage: 310, tvWattage: 0 },
        pricing: { singleRatePerHour: 40, multiRatePerHour: 48, vipRatePerHour: 68 },
        activeSession: null,
        maintenance: { totalRunTimeHours: 612, nextThermalPasteDueHours: 12, nextDeepCleanDueHours: 2 },
      },
      {
        id: "ps4-01",
        name: "CLASSIC 01",
        type: "PS4",
        status: "IDLE",
        powerSpecs: { consoleWattage: 165, tvWattage: 90 },
        pricing: { singleRatePerHour: 20, multiRatePerHour: 28, vipRatePerHour: 42 },
        activeSession: null,
        maintenance: { totalRunTimeHours: 729, nextThermalPasteDueHours: 21, nextDeepCleanDueHours: 11 },
      },
    ],
    inventory: [
      { id: "drink-01", name: "Energy Drink", category: "DRINK", barcode: "628100001", stockQty: 36, minThreshold: 12, costPrice: 4, sellPrice: 8 },
      { id: "drink-02", name: "Sparkling Water", category: "DRINK", barcode: "628100002", stockQty: 52, minThreshold: 16, costPrice: 2, sellPrice: 5 },
      { id: "snack-01", name: "Nachos", category: "SNACK", barcode: "628100003", stockQty: 8, minThreshold: 10, costPrice: 5, sellPrice: 12 },
    ],
    bundles: [
      { id: "bundle-01", title: "Squad Drop", stationType: "PS5", durationHours: 3, includedItems: [{ itemId: "drink-01", qty: 4 }], bundlePrice: 119 },
    ],
    players: [
      { id: "p-01", name: "سلمان العتيبي", phone: "+966 50 000 1024", xp: 2840, tier: "GOLD", walletBalance: 145, totalHoursPlayed: 94, favoriteGames: ["FC 26", "Valorant"] },
      { id: "p-02", name: "نورة الحربي", phone: "+966 55 000 8871", xp: 1280, tier: "SILVER", walletBalance: 62, totalHoursPlayed: 41, favoriteGames: ["Tekken 8"] },
    ],
    reservations: [
      { id: "res-01", stationId: "vip-01", playerPhone: "+966 55 000 8871", scheduledTime: Date.now() + 52 * 60 * 1000, depositPaid: 50, status: "CONFIRMED" },
    ],
    tournaments: [],
    auditLogs: [],
    shiftReport: {
      shiftId: "SHIFT-042",
      startTime: minutesAgo(265),
      operatorId: "operator-local",
      startingCash: 850,
      recordedCashSales: 1240,
      recordedDigitalSales: 980,
    },
  };
}

export function deriveMetrics(state) {
  const activeStations = state.stations.filter((station) => station.status === "ACTIVE").length;
  const totalStations = state.stations.length;
  const openSessions = state.stations.filter((station) => station.activeSession?.mode === "OPEN").length;
  const lowStockItems = state.inventory.filter((item) => item.stockQty <= item.minThreshold).length;
  const hourlyRevenue = state.shiftReport.recordedCashSales + state.shiftReport.recordedDigitalSales;
  const utilization = totalStations ? Math.round((activeStations / totalStations) * 100) : 0;

  return { activeStations, totalStations, openSessions, lowStockItems, hourlyRevenue, utilization };
}

export function formatMoney(value, currency = "SAR") {
  return new Intl.NumberFormat("ar-SA", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return "—";
  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (diffMinutes < 1) return "الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} د`;
  const hours = Math.floor(diffMinutes / 60);
  return `منذ ${hours} س`;
}
