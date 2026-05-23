import { useMemo, useState } from 'react';
import { Paper, Text, Group, Box, Button, ScrollArea, Select } from '@mantine/core';
import LightIcon from './assets/icons/LightIcon.svg';
import DarkIcon from './assets/icons/DarkIcon.svg';
import ZombieShipIcon from './assets/icons/ZombieShip.svg';
import UnattributedIcon from './assets/icons/UnattributedIcon.svg';
import SpoofingPositionIcon from './assets/icons/SpoofingPositionIcon.svg';
import StsIcon from './assets/icons/STSIcon.svg';

const TYPE_LABELS = {
  all: 'All Events',
  dark: 'Dark Activity',
  spoofing: 'Spoofing',
  detection: 'Atypical Behavior',
  port: 'Port Congestion',
  sanctions: 'Sanctions',
};

const EVENT_ICON = {
  dark: DarkIcon,
  spoofing: SpoofingPositionIcon,
  detection: UnattributedIcon,
  port: LightIcon,
  satellite: DarkIcon,
  ais: LightIcon,
  sts: StsIcon,
  sanctions: ZombieShipIcon,
  default: UnattributedIcon,
};

function formatClock(timeValue) {
  if (typeof timeValue !== 'string') return '--:--';
  return timeValue;
}

function getEventIcon(event) {
  return EVENT_ICON[event.type] ?? EVENT_ICON.default;
}

export default function IntelligenceTimeline({ timelineEvents = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeShip, setActiveShip] = useState('all');

  const shipOptions = useMemo(() => {
    const vesselNames = Array.from(
      new Set(
        timelineEvents
          .map((event) => event.vessel)
          .filter((vessel) => typeof vessel === 'string' && vessel.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    return [{ value: 'all', label: 'All Ships' }, ...vesselNames.map((name) => ({ value: name, label: name }))];
  }, [timelineEvents]);

  const timelineCards = useMemo(() => {
    const typeFiltered =
      activeFilter === 'all'
        ? timelineEvents
        : timelineEvents.filter((event) => event.type === activeFilter);

    const shipFiltered =
      activeShip === 'all'
        ? typeFiltered
        : typeFiltered.filter((event) => event.vessel === activeShip);

    return shipFiltered.slice(0, 8);
  }, [activeFilter, activeShip, timelineEvents]);

  const filterKeys = ['all', 'dark', 'spoofing', 'detection', 'port', 'sanctions'];

  return (
    <Paper
      p="md"
      radius={8}
      style={{
        background: '#24263C',
        border: '1px solid #393C56',
      }}
    >
      <Group justify="space-between" align="flex-start" mb={10}>
        <Text size="16px" fw={600} c="white">
          Intelligence Timeline
        </Text>
        <Group gap={6} justify="flex-end">
          {filterKeys.map((key) => (
            <Button
              key={key}
              size="compact-xs"
              variant={activeFilter === key ? 'filled' : 'subtle'}
              color="theia-blue"
              styles={{
                root:
                  activeFilter === key
                    ? { backgroundColor: '#006CD7', color: '#ffffff' }
                    : { color: '#888F9E' },
              }}
              onClick={() => setActiveFilter(key)}
            >
              {TYPE_LABELS[key]}
            </Button>
          ))}
          <Select
            size="xs"
            value={activeShip}
            onChange={(value) => setActiveShip(value ?? 'all')}
            data={shipOptions}
            w={170}
            styles={{
              input: {
                backgroundColor: '#181926',
                borderColor: '#393C56',
                color: '#ffffff',
              },
              dropdown: {
                backgroundColor: '#181926',
                borderColor: '#393C56',
              },
              option: {
                color: '#ffffff',
              },
            }}
          />
        </Group>
      </Group>

      <ScrollArea scrollbarSize={4} type="never" offsetScrollbars>
        <Box
          style={{
            minWidth: 780,
            paddingBottom: 24,
          }}
        >
          <Group gap={8} wrap="nowrap" align="flex-start">
            {timelineCards.map((event, idx) => (
              <Box key={`${event.time}-${event.description}-${idx}`} style={{ width: 182, minWidth: 182 }}>
                <Text size="xs" c="#888F9E" mb={4}>
                  {formatClock(event.time)}
                </Text>
                <Paper
                  p="sm"
                  radius={6}
                  style={{
                    background: '#181926',
                  }}
                >
                  <Group gap={6} wrap="nowrap" align="center">
                    <img
                      src={getEventIcon(event)}
                      alt={event.type}
                      style={{ width: 14, height: 14, display: 'block', flexShrink: 0 }}
                    />
                    <Text size="sm" fw={600} c="white" lineClamp={1}>
                      {event.vessel || TYPE_LABELS[event.type] || event.type}
                    </Text>
                  </Group>
                  <Text size="xs" c="#888F9E" lineClamp={2} mt={4}>
                    {event.description}
                  </Text>
                </Paper>
              </Box>
            ))}
          </Group>
        </Box>
      </ScrollArea>

      <Group justify="center" mt={4}>
        <Button size="xs" variant="subtle" color="theia-blue">
          View Full Timeline
        </Button>
      </Group>
    </Paper>
  );
}
