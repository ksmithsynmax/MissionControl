import { Grid, Stack, Box, Text, Button, Group } from '@mantine/core';
import MapPanel from './MapPanel';
import KpiRow from './KpiRow';
import IntelligenceTimeline from './IntelligenceTimeline';
import Timeline from './Timeline';
import OpPriorities from './OpPriorities';
import Recommendations from './Recommendations';
import { useMissionControlData } from './useMissionControlData';
import './App.css';

function App() {
  const { data, isLoading, refresh } = useMissionControlData();
  const getFlagSvgUrl = (countryCode) => {
    const code = String(countryCode || '').trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) return '';
    return `https://flagcdn.com/${code.toLowerCase()}.svg`;
  };

  const watchlistItems = data.vessels
    .filter((vessel) => {
      const detection = String(vessel.detection || '');
      return (
        detection === 'det_dark' ||
        detection === 'det_sts' ||
        detection === 'det_spoofing' ||
        vessel.flag === 'IR'
      );
    })
    .map((vessel) => {
      let reason = 'Monitored vessel';

      if (vessel.detection === 'det_dark') reason = 'Dark behavior';
      else if (vessel.detection === 'det_sts') reason = 'STS transfer';
      else if (vessel.detection === 'det_spoofing') reason = 'Spoofing';
      else if (vessel.flag === 'IR') reason = 'Sanctions exposure';

      return { ...vessel, reason };
    });
  return (
    <Box
      style={{
        background: '#181926',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box p="sm" style={{ flex: 1 }}>
        <Group justify="flex-end" mb={8}>
          <Button
            size="xs"
            variant="light"
            color="theia-blue"
            loading={isLoading}
            onClick={refresh}
          >
            Refresh Data
          </Button>
        </Group>

        {isLoading && (
          <Text size="xs" c="#888F9E" mb="xs" px="sm">
            Loading agent data...
          </Text>
        )}

        <Grid gutter={8}>
          {/* Left column — watchlist rail */}
          <Grid.Col span={2}>
            <Box
              style={{
                background: '#24263C',
                border: '1px solid #393C56',
                borderRadius: 8,
                height: '100%',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <Text size="16px" fw={600} c="white" mb="xs">
                Watchlist
              </Text>

              <Stack gap={4} style={{ overflowY: 'auto', minHeight: 0, flex: 1 }}>
                {watchlistItems.length === 0 ? (
                  <Text size="xs" c="#888F9E">
                    No vessels currently on the watchlist.
                  </Text>
                ) : (
                  watchlistItems.map((vessel) => (
                    <Box
                      key={`${vessel.mmsi ?? vessel.name}-${vessel.detection}`}
                      style={{
                        background: '#181926',
                        borderRadius: 6,
                        padding: '8px 10px',
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap" gap={6}>
                        <Text size="xs" fw={600} c="white" style={{ minWidth: 0 }} lineClamp={1}>
                          {vessel.name}
                        </Text>
                        {getFlagSvgUrl(vessel.flag) ? (
                          <img
                            src={getFlagSvgUrl(vessel.flag)}
                            alt={vessel.flag || 'flag'}
                            width={16}
                            height={12}
                            style={{ display: 'block', borderRadius: 2, flexShrink: 0 }}
                            loading="lazy"
                          />
                        ) : (
                          <Text size="10px" fw={600} c="#888F9E">
                            {vessel.flag || '--'}
                          </Text>
                        )}
                      </Group>
                      <Text size="10px" c="#888F9E">
                        {vessel.type || 'Unknown'}
                      </Text>
                    </Box>
                  ))
                )}
              </Stack>
            </Box>
          </Grid.Col>

          {/* Middle column — Map + KPIs + Timeline */}
          <Grid.Col span={7}>
            <Stack gap={8} style={{ height: '100%' }}>
              <MapPanel
                vessels={data.vessels}
                synmaxPositions={data.synmaxPositions}
                globalAisPositions={data.globalAisPositions}
                detectionTypes={data.detectionTypes}
                mapConfig={data.mapConfig}
                isLoading={isLoading}
              />
              <KpiRow vessels={data.vessels} timelineEvents={data.timelineEvents} />
              <IntelligenceTimeline timelineEvents={data.timelineEvents} />
              <Timeline timelineEvents={data.timelineEvents} />
            </Stack>
          </Grid.Col>

          {/* Right column — Priorities + Recommendations */}
          <Grid.Col span={3}>
            <Stack gap={8}>
              <OpPriorities priorities={data.priorities} />
              <Recommendations recommendations={data.recommendations} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
