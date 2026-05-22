import { Grid, Stack, Box, Text, Button, Group } from '@mantine/core';
import MapPanel from './MapPanel';
import KpiRow from './KpiRow';
import Timeline from './Timeline';
import OpPriorities from './OpPriorities';
import Recommendations from './Recommendations';
import { useMissionControlData } from './useMissionControlData';
import './App.css';

function App() {
  const { data, isLoading, refresh } = useMissionControlData();

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
          {/* Left column — future navigation rail */}
          <Grid.Col span={2}>
            <Box
              style={{
                background: '#24263C',
                border: '1px solid #393C56',
                borderRadius: 8,
                minHeight: '100%',
                padding: 16,
              }}
            >
              <Text size="sm" fw={600} c="white" mb="xs">
                Navigation
              </Text>
              <Text size="xs" c="#888F9E">
                Left rail placeholder
              </Text>
            </Box>
          </Grid.Col>

          {/* Middle column — Map + KPIs + Timeline */}
          <Grid.Col span={7}>
            <Stack gap={8} style={{ height: '100%' }}>
              <MapPanel
                vessels={data.vessels}
                detectionTypes={data.detectionTypes}
                mapConfig={data.mapConfig}
              />
              <KpiRow vessels={data.vessels} timelineEvents={data.timelineEvents} />
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
