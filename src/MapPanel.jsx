import { useMemo, useState } from 'react';
import { Button, Text, Box, Group, Stack } from '@mantine/core';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import LightIcon from './assets/icons/LightIcon.svg';
import DarkIcon from './assets/icons/DarkIcon.svg';
import ZombieShipIcon from './assets/icons/ZombieShip.svg';
import UnattributedIcon from './assets/icons/UnattributedIcon.svg';
import SpoofingPositionIcon from './assets/icons/SpoofingPositionIcon.svg';
import StsIcon from './assets/icons/STSIcon.svg';
import AisStsIcon from './assets/icons/STSAISAISIcon.svg';
import CargoMovingIcon from './assets/icons/CargoMovingIcon.svg';
import CargoIdleIcon from './assets/icons/CargoIdleIcon.svg';
import TankerMovingIcon from './assets/icons/TankerMovingIcon.svg';
import TankerIdleIcon from './assets/icons/TankerIdle.svg';
import PassengerMovingIcon from './assets/icons/PassengerMovingIcon.svg';
import PassengerIdleIcon from './assets/icons/PassengerIdleIcon.svg';
import HighSpeedCraftMovingIcon from './assets/icons/HighSpeedCraftMovingIcon.svg';
import HighSpeedCraftIdleIcon from './assets/icons/HighSpeedCraftIdleIcon.svg';
import TugMovingIcon from './assets/icons/TugMovingIcon.svg';
import TugIdleIcon from './assets/icons/TugIdle.svg';
import FishingMovingIcon from './assets/icons/FishingMovingIcon.svg';
import FishingIdleIcon from './assets/icons/FishingIdleIcon.svg';
import PleasureCraftMovingIcon from './assets/icons/PleasureCraftMovingIcon.svg';
import PleasureCraftIdleIcon from './assets/icons/PleasureCraftIdleIcon.svg';
import UnspecifiedShipMovingIcon from './assets/icons/UnspecifiedShipMovingIcon.svg';
import UnspecifiedShipIdleIcon from './assets/icons/UnspecifiedShipIdleIcon.svg';

const DEFAULT_BOUNDS = { minLat: 25.0, maxLat: 27.0, minLon: 55.5, maxLon: 57.2 };

const DETECTION_META = {
  light: { label: 'Light', color: '#00A3E3', icon: LightIcon, iconSize: [16, 22], iconAnchor: [8, 11] },
  dark: { label: 'Dark', color: '#FFA500', icon: DarkIcon, iconSize: [16, 22], iconAnchor: [8, 11] },
  sanctioned: {
    label: 'Sanctioned',
    color: '#FF5C5C',
    icon: ZombieShipIcon,
    iconSize: [16, 22],
    iconAnchor: [8, 11],
  },
  unattributed: {
    label: 'Unattributed',
    color: '#9CA3AF',
    icon: UnattributedIcon,
    iconSize: [16, 22],
    iconAnchor: [8, 11],
  },
  spoofed_position: {
    label: 'Spoofed Position',
    color: '#FF6D99',
    icon: SpoofingPositionIcon,
    iconSize: [16, 22],
    iconAnchor: [8, 11],
  },
  ship_to_ship: { label: 'Ship-To-Ship', color: '#FFA500', icon: StsIcon, iconSize: [16, 16], iconAnchor: [8, 8] },
  ais_ship_to_ship: {
    label: 'AIS Ship-To-Ship',
    color: '#5FD771',
    icon: AisStsIcon,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  },
};

const SHIP_META = {
  cargo_vessels: {
    label: 'Cargo Vessels',
    color: '#5FD771',
    movingIcon: CargoMovingIcon,
    idleIcon: CargoIdleIcon,
  },
  tankers: {
    label: 'Tankers',
    color: '#FF5C5C',
    movingIcon: TankerMovingIcon,
    idleIcon: TankerIdleIcon,
  },
  passenger_vessels: {
    label: 'Passenger Vessels',
    color: '#4D7CFE',
    movingIcon: PassengerMovingIcon,
    idleIcon: PassengerIdleIcon,
  },
  high_speed_craft: {
    label: 'High Speed Craft',
    color: '#FFD166',
    movingIcon: HighSpeedCraftMovingIcon,
    idleIcon: HighSpeedCraftIdleIcon,
  },
  tugs_special_craft: {
    label: 'Tugs & Special Craft',
    color: '#7ADCDB',
    movingIcon: TugMovingIcon,
    idleIcon: TugIdleIcon,
  },
  fishing: {
    label: 'Fishing',
    color: '#F4A261',
    movingIcon: FishingMovingIcon,
    idleIcon: FishingIdleIcon,
  },
  pleasure_craft: {
    label: 'Pleasure Craft',
    color: '#C084FC',
    movingIcon: PleasureCraftMovingIcon,
    idleIcon: PleasureCraftIdleIcon,
  },
  unspecified_ships: {
    label: 'Unspecified Ships',
    color: '#B8BCC8',
    movingIcon: UnspecifiedShipMovingIcon,
    idleIcon: UnspecifiedShipIdleIcon,
  },
  other: {
    label: 'Other',
    color: '#9CA3AF',
    movingIcon: UnspecifiedShipMovingIcon,
    idleIcon: UnspecifiedShipIdleIcon,
  },
};

const DETECTION_ORDER = [
  'light',
  'dark',
  'sanctioned',
  'unattributed',
  'spoofed_position',
  'ship_to_ship',
  'ais_ship_to_ship',
];

const SHIP_ORDER = [
  'cargo_vessels',
  'tankers',
  'passenger_vessels',
  'high_speed_craft',
  'tugs_special_craft',
  'fishing',
  'pleasure_craft',
  'unspecified_ships',
];

function getCenter(bounds) {
  return [
    (bounds.minLat + bounds.maxLat) / 2,
    (bounds.minLon + bounds.maxLon) / 2,
  ];
}

function getDetectionCategory(vessel) {
  if (vessel.detection === 'det_sts') return 'ship_to_ship';
  if (vessel.detection === 'det_dark') return 'dark';
  if (vessel.detection === 'det_spoofing') return 'spoofed_position';
  if (vessel.status === 'STS Transfer' && String(vessel.detection || '').startsWith('ais_')) {
    return 'ais_ship_to_ship';
  }
  if (!vessel.mmsi || !vessel.flag) return 'unattributed';
  if (vessel.flag === 'IR') return 'sanctioned';
  return 'light';
}

function getPopupPlacement(lat, bounds) {
  const span = bounds.maxLat - bounds.minLat;
  const nearTopThreshold = bounds.maxLat - span * 0.25;
  if (lat >= nearTopThreshold) {
    return { offset: [0, 18], direction: 'bottom' };
  }
  return { offset: [0, -10], direction: 'top' };
}

function getShipCategory(vessel) {
  const type = String(vessel.type || '').toLowerCase();
  if (type.includes('cargo')) return 'cargo_vessels';
  if (type.includes('tanker')) return 'tankers';
  if (type.includes('passenger')) return 'passenger_vessels';
  if (type.includes('speed') || type.includes('hsc')) return 'high_speed_craft';
  if (type.includes('tug') || type.includes('special')) return 'tugs_special_craft';
  if (type.includes('fish')) return 'fishing';
  if (type.includes('pleasure') || type.includes('yacht')) return 'pleasure_craft';
  if (type) return 'unspecified_ships';
  return 'other';
}

function getShipMarkerIcon(categoryKey, vessel) {
  const meta = SHIP_META[categoryKey] ?? SHIP_META.other;
  const isMoving = Number(vessel?.speed ?? 0) > 0.5;
  const iconSrc = isMoving ? meta.movingIcon : meta.idleIcon;
  const rotation = isMoving && Number.isFinite(Number(vessel?.course)) ? Number(vessel.course) : 0;

  return L.divIcon({
    className: '',
    iconSize: [16, 22],
    iconAnchor: [8, 11],
    popupAnchor: [0, -10],
    html: `
      <img
        src="${iconSrc}"
        alt="${meta.label}"
        style="
          width:16px;
          height:22px;
          display:block;
          transform: rotate(${rotation}deg);
          transform-origin: 50% 50%;
        "
      />
    `,
  });
}

function getDetectionMarkerIcon(categoryKey, course) {
  const meta = DETECTION_META[categoryKey] ?? DETECTION_META.light;
  const [width, height] = meta.iconSize;
  const [anchorX, anchorY] = meta.iconAnchor;
  const rotation =
    categoryKey === 'spoofed_position' ? 0 : Number.isFinite(Number(course)) ? Number(course) : 0;

  return L.divIcon({
    className: '',
    iconSize: [width, height],
    iconAnchor: [anchorX, anchorY],
    popupAnchor: [0, -10],
    html: `
      <img
        src="${meta.icon}"
        alt="${meta.label}"
        style="
          width:${width}px;
          height:${height}px;
          display:block;
          transform: rotate(${rotation}deg);
          transform-origin: 50% 50%;
        "
      />
    `,
  });
}

function LegendIcon({ src, alt }) {
  return <img src={src} alt={alt} style={{ width: 14, height: 14, display: 'block' }} />;
}

export default function MapPanel({
  vessels = [],
  synmaxPositions = [],
  globalAisPositions = [],
  detectionTypes = {},
  mapConfig = {},
  isLoading = false,
}) {
  const [mode, setMode] = useState('synmax');
  const bounds = mapConfig.bounds ?? DEFAULT_BOUNDS;
  const center = getCenter(bounds);
  const mapBounds = [
    [bounds.minLat, bounds.minLon],
    [bounds.maxLat, bounds.maxLon],
  ];
  const synmaxFeed = synmaxPositions.length > 0 ? synmaxPositions : vessels;
  const globalAisFeed =
    globalAisPositions.length > 0
      ? globalAisPositions
      : vessels.filter((vessel) => String(vessel.detection || '').startsWith('ais_'));
  const activeVessels = mode === 'synmax' ? synmaxFeed : globalAisFeed;
  const isFallbackFeed =
    (mode === 'synmax' && synmaxPositions.length === 0) ||
    (mode === 'global_ais' && globalAisPositions.length === 0);

  const plottedVessels = useMemo(() => {
    return activeVessels.map((vessel) => {
      if (mode === 'synmax') {
        const categoryKey = getDetectionCategory(vessel);
        return {
          ...vessel,
          categoryKey,
          categoryLabel: DETECTION_META[categoryKey]?.label ?? 'Unknown',
          categoryType: 'Detection',
        };
      }

      const categoryKey = getShipCategory(vessel);
      return {
        ...vessel,
        categoryKey,
        categoryLabel: SHIP_META[categoryKey]?.label ?? 'Other',
        categoryType: 'Ship Type',
      };
    });
  }, [activeVessels, mode]);

  return (
    <Box
      style={{
        height: 480,
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid #393C56',
        position: 'relative',
      }}
    >
        <MapContainer
          center={center}
          zoom={9}
          minZoom={7}
          maxZoom={14}
          maxBounds={mapBounds}
          attributionControl={false}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {plottedVessels.map((vessel) => {
            const detection = detectionTypes[vessel.detection];
            const isSynmaxMode = mode === 'synmax';
            const popupPlacement = getPopupPlacement(vessel.lat, bounds);

            return (
              isSynmaxMode ? (
                <Marker
                  key={`${mode}-${vessel.mmsi ?? vessel.name}-${vessel.lat}-${vessel.lon}`}
                  position={[vessel.lat, vessel.lon]}
                  icon={getDetectionMarkerIcon(vessel.categoryKey, vessel.course)}
                >
                  <Popup offset={popupPlacement.offset} direction={popupPlacement.direction}>
                    <div style={{ minWidth: 220 }}>
                      <strong>{vessel.name}</strong>
                      <br />
                      Type: {vessel.type}
                      <br />
                      Flag: {vessel.flag}
                      <br />
                      Status: {vessel.status}
                      <br />
                      Speed: {vessel.speed} kn
                      <br />
                      Course: {vessel.course} deg
                      <br />
                      Detection: {detection?.label ?? vessel.detection}
                      <br />
                      {vessel.categoryType}: {vessel.categoryLabel}
                    </div>
                  </Popup>
                </Marker>
              ) : (
                <Marker
                  key={`${mode}-${vessel.mmsi ?? vessel.name}-${vessel.lat}-${vessel.lon}`}
                  position={[vessel.lat, vessel.lon]}
                  icon={getShipMarkerIcon(vessel.categoryKey, vessel)}
                >
                  <Popup offset={popupPlacement.offset} direction={popupPlacement.direction}>
                    <div style={{ minWidth: 220 }}>
                      <strong>{vessel.name}</strong>
                      <br />
                      Type: {vessel.type}
                      <br />
                      Flag: {vessel.flag}
                      <br />
                      Status: {vessel.status}
                      <br />
                      Speed: {vessel.speed} kn
                      <br />
                      Course: {vessel.course} deg
                      <br />
                      Detection: {detection?.label ?? vessel.detection}
                      <br />
                      {vessel.categoryType}: {vessel.categoryLabel}
                    </div>
                  </Popup>
                </Marker>
              )
            );
          })}
        </MapContainer>

        <Box
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 420,
            background: '#181926',
            border: '1px solid #393C56',
            borderRadius: 8,
            padding: 4,
          }}
        >
          {isLoading ? (
            <Box
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 430,
                background: 'rgba(24, 25, 38, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Text size="sm" c="#ffffff" fw={600}>
                Refreshing positions...
              </Text>
            </Box>
          ) : null}

          {isFallbackFeed ? (
            <Box
              style={{
                position: 'absolute',
                top: 54,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 425,
                background: 'rgba(24, 25, 38, 0.92)',
                border: '1px solid #393C56',
                borderRadius: 6,
                padding: '4px 8px',
              }}
            >
              <Text size="xs" c="#888F9E">
                {mode === 'synmax'
                  ? 'SynMax feed unavailable - using default positions'
                  : 'Global AIS feed unavailable - using AIS-only fallback'}
              </Text>
            </Box>
          ) : null}

          <Group gap={4} wrap="nowrap">
            <Button
              size="xs"
              variant={mode === 'synmax' ? 'filled' : 'subtle'}
              color="theia-blue"
              styles={{
                root: {
                  ...(mode === 'synmax'
                    ? {
                        backgroundColor: '#006CD7',
                        borderColor: '#006CD7',
                        color: '#ffffff',
                      }
                    : {}),
                  '&:hover': {
                    backgroundColor:
                      mode === 'synmax'
                        ? '#006CD7 !important'
                        : 'rgba(0, 108, 215, 0.2) !important',
                    borderColor: '#006CD7 !important',
                    color: '#ffffff !important',
                  },
                },
              }}
              onClick={() => setMode('synmax')}
            >
              SynMax
            </Button>
            <Button
              size="xs"
              variant={mode === 'global_ais' ? 'filled' : 'subtle'}
              color="theia-blue"
              styles={{
                root: {
                  ...(mode === 'global_ais'
                    ? {
                        backgroundColor: '#006CD7',
                        borderColor: '#006CD7',
                        color: '#ffffff',
                      }
                    : {}),
                  '&:hover': {
                    backgroundColor:
                      mode === 'global_ais'
                        ? '#006CD7 !important'
                        : 'rgba(0, 108, 215, 0.2) !important',
                    borderColor: '#006CD7 !important',
                    color: '#ffffff !important',
                  },
                },
              }}
              onClick={() => setMode('global_ais')}
            >
              Global AIS
            </Button>
          </Group>
        </Box>

        <Box
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            zIndex: 410,
            background: 'rgba(24, 25, 38, 0.9)',
            border: '1px solid #393C56',
            borderRadius: 6,
            padding: '8px 10px',
            maxWidth: 220,
          }}
        >
          <Stack gap={6}>
            {mode === 'synmax'
              ? DETECTION_ORDER.map((key) => {
                  const det = DETECTION_META[key];
                  return (
                    <Group key={key} gap={6} wrap="nowrap">
                      <LegendIcon src={det.icon} alt={det.label} />
                      <Text size="xs" c="#888F9E">
                        {det.label}
                      </Text>
                    </Group>
                  );
                })
              : SHIP_ORDER.map((key) => {
                  const ship = SHIP_META[key];
                  return (
                    <Group key={key} gap={6} wrap="nowrap">
                      <LegendIcon src={ship.movingIcon} alt={ship.label} />
                      <Text size="xs" c="#888F9E">
                        {ship.label}
                      </Text>
                    </Group>
                  );
                })}
          </Stack>
        </Box>
    </Box>
  );
}
