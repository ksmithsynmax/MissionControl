import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  vessels as mockVessels,
  detectionTypes as mockDetectionTypes,
  timelineEvents as mockTimelineEvents,
  priorities as mockPriorities,
  recommendations as mockRecommendations,
  mapConfig as mockMapConfig,
} from './data';

const EARTH_RADIUS_NM = 3440.065;

function isAisVessel(vessel) {
  return String(vessel?.detection || '').startsWith('ais_');
}

function projectByCourse(lat, lon, courseDeg, distanceNm) {
  const bearing = ((courseDeg ?? 0) * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;
  const angDist = distanceNm / EARTH_RADIUS_NM;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angDist) +
      Math.cos(lat1) * Math.sin(angDist) * Math.cos(bearing)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angDist) * Math.cos(lat1),
      Math.cos(angDist) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: (lat2 * 180) / Math.PI,
    lon: (lon2 * 180) / Math.PI,
  };
}

function deriveGlobalAisFallback(vessels) {
  const lookbackHours = 0.35; // ~21 minutes

  return vessels.filter(isAisVessel).map((vessel) => {
    const speed = Number(vessel.speed) || 0;
    const distanceNm = speed * lookbackHours;

    if (distanceNm <= 0) return { ...vessel };

    // Project slightly backward along course to emulate lagged AIS positions.
    const backwardCourse = ((Number(vessel.course) || 0) + 180) % 360;
    const projected = projectByCourse(vessel.lat, vessel.lon, backwardCourse, distanceNm);

    return {
      ...vessel,
      lat: Number(projected.lat.toFixed(5)),
      lon: Number(projected.lon.toFixed(5)),
    };
  });
}

const DEFAULT_DATA = {
  vessels: mockVessels,
  synmaxPositions: mockVessels,
  globalAisPositions: deriveGlobalAisFallback(mockVessels),
  detectionTypes: mockDetectionTypes,
  timelineEvents: mockTimelineEvents,
  priorities: mockPriorities,
  recommendations: mockRecommendations,
  mapConfig: mockMapConfig,
};

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizePayload(payload) {
  if (!isObject(payload)) return null;

  const root = isObject(payload.data) ? payload.data : payload;
  const timelineEvents = Array.isArray(root.timelineEvents)
    ? root.timelineEvents
    : Array.isArray(root.timeline)
      ? root.timeline
      : undefined;

  const normalized = {
    vessels: Array.isArray(root.vessels) ? root.vessels : undefined,
    synmaxPositions: Array.isArray(root.synmaxPositions) ? root.synmaxPositions : undefined,
    globalAisPositions: Array.isArray(root.globalAisPositions) ? root.globalAisPositions : undefined,
    detectionTypes: isObject(root.detectionTypes) ? root.detectionTypes : undefined,
    timelineEvents,
    priorities: Array.isArray(root.priorities) ? root.priorities : undefined,
    recommendations: Array.isArray(root.recommendations) ? root.recommendations : undefined,
    mapConfig: isObject(root.mapConfig) ? root.mapConfig : undefined,
  };

  const hasDataset =
    normalized.vessels ||
    normalized.synmaxPositions ||
    normalized.globalAisPositions ||
    normalized.timelineEvents ||
    normalized.priorities ||
    normalized.recommendations;

  return hasDataset ? normalized : null;
}

export function useMissionControlData() {
  const endpoint = import.meta.env.VITE_MISSION_DATA_URL || '/api/mission-control';
  const [remoteData, setRemoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const normalized = normalizePayload(payload);

      if (!normalized) {
        throw new Error('Payload missing expected dashboard fields');
      }

      setRemoteData(normalized);
      setIsLive(true);
      setLastUpdated(new Date());
    } catch (err) {
      setIsLive(false);
      setError(err instanceof Error ? err.message : 'Unknown data fetch error');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const data = useMemo(() => {
    if (!remoteData) return DEFAULT_DATA;

    return {
      vessels: remoteData.vessels ?? DEFAULT_DATA.vessels,
      // SynMax can fall back to the main vessel feed.
      synmaxPositions:
        remoteData.synmaxPositions ?? remoteData.vessels ?? DEFAULT_DATA.synmaxPositions,
      // If a dedicated AIS feed is missing, derive a lagged AIS-only fallback.
      globalAisPositions:
        remoteData.globalAisPositions ??
        deriveGlobalAisFallback(remoteData.vessels ?? DEFAULT_DATA.vessels),
      timelineEvents: remoteData.timelineEvents ?? DEFAULT_DATA.timelineEvents,
      priorities: remoteData.priorities ?? DEFAULT_DATA.priorities,
      recommendations: remoteData.recommendations ?? DEFAULT_DATA.recommendations,
      detectionTypes: {
        ...DEFAULT_DATA.detectionTypes,
        ...(remoteData.detectionTypes ?? {}),
      },
      mapConfig: {
        ...DEFAULT_DATA.mapConfig,
        ...(remoteData.mapConfig ?? {}),
      },
    };
  }, [remoteData]);

  return { data, isLoading, isLive, error, endpoint, lastUpdated, refresh };
}
