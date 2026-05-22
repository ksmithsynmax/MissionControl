import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  vessels as mockVessels,
  detectionTypes as mockDetectionTypes,
  timelineEvents as mockTimelineEvents,
  priorities as mockPriorities,
  recommendations as mockRecommendations,
  mapConfig as mockMapConfig,
} from './data';

const DEFAULT_DATA = {
  vessels: mockVessels,
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
    detectionTypes: isObject(root.detectionTypes) ? root.detectionTypes : undefined,
    timelineEvents,
    priorities: Array.isArray(root.priorities) ? root.priorities : undefined,
    recommendations: Array.isArray(root.recommendations) ? root.recommendations : undefined,
    mapConfig: isObject(root.mapConfig) ? root.mapConfig : undefined,
  };

  const hasDataset =
    normalized.vessels ||
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
