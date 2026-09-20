import { useCallback, useEffect, useMemo, useState } from "react";
import { createDefaultState, deriveMetrics } from "../lib/domain.js";
import { captureSnapshot, loadState, persistState } from "../lib/storage.js";
import { flushSyncQueue, queueSync } from "../lib/sync.js";

export function usePlayroomState() {
  const [state, setState] = useState(loadState);
  const [lastSnapshotAt, setLastSnapshotAt] = useState(null);
  const [isOnline, setIsOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const metrics = useMemo(() => deriveMetrics(state), [state]);

  useEffect(() => {
    persistState(state);
    queueSync({ state, savedAt: Date.now() });
  }, [state]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const snapshot = captureSnapshot(state, "interval");
      if (snapshot) setLastSnapshotAt(snapshot.capturedAt);
    }, state.systemConfig.autoCaptureIntervalSec * 1000);

    const online = () => {
      setIsOnline(true);
      flushSyncQueue();
    };
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, [state.systemConfig.autoCaptureIntervalSec]);

  const updateState = useCallback((updater) => {
    setState((current) => (typeof updater === "function" ? updater(current) : updater));
  }, []);

  const captureNow = useCallback(() => {
    const snapshot = captureSnapshot(state, "manual");
    if (snapshot) setLastSnapshotAt(snapshot.capturedAt);
    return snapshot;
  }, [state]);

  const startSession = useCallback((stationId) => {
    updateState((current) => ({
      ...current,
      stations: current.stations.map((station) => station.id !== stationId ? station : {
        ...station,
        status: "ACTIVE",
        activeSession: {
          sessionId: `SES-${Math.floor(Math.random() * 9000 + 1000)}`,
          mode: "OPEN",
          controllerCount: 2,
          startTime: Date.now(),
          endTime: null,
          paused: false,
          accumulatedPausedMs: 0,
          ordersTab: [],
          splitBill: [],
        },
      }),
    }));
  }, [updateState]);

  const pauseSession = useCallback((stationId) => {
    updateState((current) => ({
      ...current,
      stations: current.stations.map((station) => station.id !== stationId || !station.activeSession ? station : {
        ...station,
        activeSession: { ...station.activeSession, paused: !station.activeSession.paused },
      }),
    }));
  }, [updateState]);

  const finishSession = useCallback((stationId) => {
    updateState((current) => ({
      ...current,
      stations: current.stations.map((station) => station.id !== stationId ? station : {
        ...station,
        status: "IDLE",
        activeSession: null,
      }),
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        operatorId: "operator-local",
        action: "SESSION_CANCEL",
        details: `تم إنهاء جلسة المحطة ${stationId}`,
      }, ...current.auditLogs],
    }));
  }, [updateState]);

  const setStationStatus = useCallback((stationId, status) => {
    updateState((current) => ({
      ...current,
      stations: current.stations.map((station) => station.id === stationId ? { ...station, status } : station),
    }));
  }, [updateState]);

  const resetToSeed = useCallback(() => setState(createDefaultState()), []);

  return {
    state,
    metrics,
    lastSnapshotAt,
    isOnline,
    updateState,
    captureNow,
    startSession,
    pauseSession,
    finishSession,
    setStationStatus,
    resetToSeed,
  };
}
