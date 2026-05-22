import { Text, Box, Group, Stack } from '@mantine/core';
import { CircleMarker, MapContainer, Popup, TileLayer, ZoomControl } from 'react-leaflet';

const DEFAULT_BOUNDS = { minLat: 25.0, maxLat: 27.0, minLon: 55.5, maxLon: 57.2 };

function getCenter(bounds) {
  return [
    (bounds.minLat + bounds.maxLat) / 2,
    (bounds.minLon + bounds.maxLon) / 2,
  ];
}

function getMarkerStyle(detectionTypes, detectionKey) {
  const det = detectionTypes[detectionKey] ?? {};
  const color = det.color ?? '#888F9E';

  return {
    radius: det.shape === 'paired' ? 8 : 6,
    color,
    fillColor: color,
    fillOpacity: 0.9,
    weight: 1,
  };
}

export default function MapPanel({
  vessels = [],
  detectionTypes = {},
  mapConfig = {},
}) {
  const bounds = mapConfig.bounds ?? DEFAULT_BOUNDS;
  const center = getCenter(bounds);
  const mapBounds = [
    [bounds.minLat, bounds.minLon],
    [bounds.maxLat, bounds.maxLon],
  ];

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

          {vessels.map((vessel) => {
            const markerStyle = getMarkerStyle(detectionTypes, vessel.detection);
            const detection = detectionTypes[vessel.detection];

            return (
              <CircleMarker
                key={`${vessel.mmsi ?? vessel.name}-${vessel.lat}-${vessel.lon}`}
                center={[vessel.lat, vessel.lon]}
                {...markerStyle}
              >
                <Popup>
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
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        <Box
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            zIndex: 500,
            background: 'rgba(24, 25, 38, 0.9)',
            border: '1px solid #393C56',
            borderRadius: 6,
            padding: '8px 10px',
            maxWidth: 220,
          }}
        >
          <Stack gap={6}>
            {Object.entries(detectionTypes).map(([key, det]) => (
              <Group key={key} gap={6} wrap="nowrap">
                <Box
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: det.shape === 'rect' ? 2 : 99,
                    background: det.color,
                  }}
                />
                <Text size="xs" c="#888F9E">
                  {det.label}
                </Text>
              </Group>
            ))}
          </Stack>
        </Box>
    </Box>
  );
}
