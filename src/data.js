// Mission Control — Strait of Hormuz Data
// Replace with live Theia API data later

export const vessels = [
  // Active Tankers (AIS on, moving) — Theia: ais_tanker_moving (red #FF5C5C triangles)
  { name: 'MAHARAH', mmsi: 403123456, type: 'Tanker', flag: 'SA', lat: 26.25, lon: 56.35, speed: 12.1, course: 135, status: 'Active', detection: 'ais_tanker' },
  { name: 'AL DAFNA', mmsi: 466234567, type: 'Tanker', flag: 'QA', lat: 26.55, lon: 56.55, speed: 11.8, course: 310, status: 'Active', detection: 'ais_tanker' },
  { name: 'DUBAI HARMONY', mmsi: 470345678, type: 'Tanker', flag: 'AE', lat: 25.85, lon: 56.80, speed: 9.5, course: 195, status: 'Active', detection: 'ais_tanker' },
  { name: 'FRONT COURAGE', mmsi: 538456789, type: 'Tanker', flag: 'MH', lat: 26.40, lon: 56.10, speed: 13.2, course: 145, status: 'Active', detection: 'ais_tanker' },
  { name: 'MARAN SAGITTA', mmsi: 241567890, type: 'Tanker', flag: 'GR', lat: 25.95, lon: 56.50, speed: 10.7, course: 180, status: 'Active', detection: 'ais_tanker' },

  // Active Cargo (AIS on, moving) — Theia: ais_cargo_moving (green #5FD771 triangles)
  { name: 'GULF PEARL', mmsi: 470567890, type: 'Cargo', flag: 'AE', lat: 25.70, lon: 56.70, speed: 8.3, course: 220, status: 'Active', detection: 'ais_cargo' },
  { name: 'HORMUZ TRADER', mmsi: 422678901, type: 'Cargo', flag: 'IR', lat: 26.65, lon: 56.20, speed: 7.1, course: 90, status: 'Active', detection: 'ais_cargo' },

  // Dark Vessels (AIS off, SAR detection) — Theia: det_dark (orange #FFA500)
  { name: 'SABITI', mmsi: 422111222, type: 'Tanker', flag: 'IR', lat: 26.10, lon: 56.65, speed: 0, course: 0, status: 'Dark', detection: 'det_dark' },
  { name: 'ADRIAN DARYA', mmsi: 422333444, type: 'Tanker', flag: 'IR', lat: 26.70, lon: 56.45, speed: 0, course: 0, status: 'Dark', detection: 'det_dark' },

  // STS Transfer — Theia: det_sts_ll (paired rectangles)
  { name: 'HAPPINESS I', mmsi: 352555666, type: 'Tanker', flag: 'PA', lat: 25.55, lon: 56.38, speed: 0.2, course: 45, status: 'STS Transfer', detection: 'det_sts' },
  { name: 'ABYSS', mmsi: 616777888, type: 'Tanker', flag: 'CM', lat: 25.53, lon: 56.40, speed: 0.1, course: 225, status: 'STS Transfer', detection: 'det_sts' },

  // Spoofing — Theia: det_spoofing_ship (pink #FF6D99)
  { name: 'IRAN SHAHR', mmsi: 422999111, type: 'Tanker', flag: 'IR', lat: 26.35, lon: 56.70, speed: 8.5, course: 160, status: 'Spoofing', detection: 'det_spoofing' },

  // Anchored/Idle — Theia: ais_tanker_idle (red rectangle, no direction)
  { name: 'SOHAR MAX', mmsi: 461222333, type: 'Tanker', flag: 'OM', lat: 25.42, lon: 56.55, speed: 0, course: 0, status: 'Anchored', detection: 'ais_tanker_idle' },

  // Tug — Theia: ais_tug_moving (teal #7ADCDB triangle)
  { name: 'RAS AL KHAIMAH TUG 3', mmsi: 470888999, type: 'Tug', flag: 'AE', lat: 25.60, lon: 56.60, speed: 5.2, course: 330, status: 'Active', detection: 'ais_tug' },
];

// Detection type color/shape mapping (matches Theia icon library)
export const detectionTypes = {
  ais_tanker:      { label: 'AIS Tanker',     color: '#FF5C5C', shape: 'triangle', moving: true },
  ais_cargo:       { label: 'AIS Cargo',      color: '#5FD771', shape: 'triangle', moving: true },
  ais_tanker_idle: { label: 'Tanker (Idle)',   color: '#FF5C5C', shape: 'rect',     moving: false },
  ais_tug:         { label: 'AIS Tug',        color: '#7ADCDB', shape: 'triangle', moving: true },
  det_dark:        { label: 'Dark (SAR)',      color: '#FFA500', shape: 'diamond',  moving: false },
  det_sts:         { label: 'STS Transfer',   color: '#FFA500', shape: 'paired',   moving: false },
  det_spoofing:    { label: 'Spoofing',       color: '#FF6D99', shape: 'diamond',  moving: false },
};

export const kpis = [
  { label: 'Vessels Tracked', value: 14 },
  { label: 'Dark Vessels', value: 2 },
  { label: 'Active STS', value: 1 },
  { label: 'Active Alerts', value: 4 },
];

export const timeline = [
  { time: '14:32', description: 'SABITI AIS signal lost — entering dark period', severity: 'critical', type: 'dark', vessel: 'SABITI' },
  { time: '14:15', description: 'SAR detection confirms ADRIAN DARYA south of Qeshm', severity: 'critical', type: 'detection', vessel: 'ADRIAN DARYA' },
  { time: '13:58', description: 'IRAN SHAHR AIS position inconsistent with SAR — spoofing confirmed', severity: 'critical', type: 'spoofing', vessel: 'IRAN SHAHR' },
  { time: '13:45', description: 'HAPPINESS I & ABYSS proximity alert — STS transfer initiated', severity: 'critical', type: 'sts', vessel: 'HAPPINESS I' },
  { time: '13:30', description: 'MAHARAH transiting inbound lane at 12.1 kn', severity: 'info', type: 'ais', vessel: 'MAHARAH' },
  { time: '13:12', description: 'Sentinel-1 SAR pass — 3 dark detections in Hormuz corridor', severity: 'warning', type: 'satellite', vessel: null },
  { time: '12:55', description: 'FRONT COURAGE cleared Fujairah anchorage, heading SE', severity: 'info', type: 'ais', vessel: 'FRONT COURAGE' },
  { time: '12:40', description: 'IRGC fast-boat cluster detected near Larak Island', severity: 'critical', type: 'detection', vessel: null },
  { time: '12:20', description: 'SOHAR MAX anchored at Fujairah — awaiting berth', severity: 'info', type: 'port', vessel: 'SOHAR MAX' },
  { time: '11:58', description: 'GULF PEARL AIS destination updated: JEBEL ALI', severity: 'info', type: 'ais', vessel: 'GULF PEARL' },
];

// Backward-compatible aliases used by UI components.
export const timelineEvents = timeline;

export const mapConfig = {
  bounds: { minLat: 25.0, maxLat: 27.0, minLon: 55.5, maxLon: 57.2 },
};

export const priorities = [
  { id: 'P1', title: 'STS Transfer — Khor Fakkan Anchorage', urgency: 'HIGH', description: 'HAPPINESS I and ABYSS conducting ship-to-ship transfer in Khor Fakkan anchorage zone. ABYSS is Cameroon-flagged with no public beneficial owner.', status: 'Monitoring' },
  { id: 'P2', title: 'AIS Spoofing — IRAN SHAHR', urgency: 'HIGH', description: 'IRAN SHAHR broadcasting position near Fujairah but SAR imagery confirms vessel is 40 nm northeast, near Qeshm Island.', status: 'Confirmed' },
  { id: 'P3', title: 'Dark Tankers — SABITI & ADRIAN DARYA', urgency: 'MEDIUM', description: 'Two NITC-linked tankers operating dark in the strait. Last SAR detection places both near Qeshm and Larak Islands.', status: 'Tracking' },
  { id: 'P4', title: 'IRGC Fast-Boat Activity — Larak Island', urgency: 'LOW', description: 'Cluster of 4 fast-boats detected via optical satellite near Larak Island naval facility. Consistent with routine patrol patterns.', status: 'Watching' },
];

export const recommendations = [
  { type: 'Investigate', title: 'Trace ABYSS ownership chain', reason: 'Cameroon-flagged vessel with no public beneficial owner. 4 STS events in Khor Fakkan in 60 days.', tag: 'Suggested' },
  { type: 'Geofence', title: 'Set alert on Qeshm anchorage', reason: 'High dark-vessel density area. Auto-alert when new SAR detections appear within 10 nm.', tag: 'Recommended' },
  { type: 'Report', title: 'Generate Hormuz transit summary', reason: 'Weekly transit report ready. 47 tanker transits, 3 dark events, 1 STS this week.', tag: 'Ready' },
  { type: 'Watchlist', title: 'Add IRAN SHAHR to watchlist', reason: 'Confirmed spoofing vessel. Track all future AIS broadcasts and cross-reference SAR.', tag: 'Action' },
  { type: 'Review', title: 'Kharg Island loading activity', reason: '12 tankers loaded at Kharg this week — 3 with unknown destination. Cross-reference dark events.', tag: 'Pending' },
];
