import { Paper, Text, Stack, Group, Box } from '@mantine/core';
import LightIcon from './assets/icons/LightIcon.svg';
import DarkIcon from './assets/icons/DarkIcon.svg';
import ZombieShipIcon from './assets/icons/ZombieShip.svg';
import UnattributedIcon from './assets/icons/UnattributedIcon.svg';
import SpoofingPositionIcon from './assets/icons/SpoofingPositionIcon.svg';
import StsIcon from './assets/icons/STSIcon.svg';
import AisStsIcon from './assets/icons/STSAISAISIcon.svg';

const severityColor = {
  critical: '#F75349',
  warning: '#FFA500',
  info: '#00A3E3',
};

const EVENT_ICON = {
  dark: DarkIcon,
  spoofing: SpoofingPositionIcon,
  detection: UnattributedIcon,
  sts: StsIcon,
  ais: LightIcon,
  sanctions: ZombieShipIcon,
  ais_sts: AisStsIcon,
};

function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value !== 'string') return null;

  // Support timeline data using HH:mm strings such as "14:32".
  const hhmmMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (hhmmMatch) {
    const [, hh, mm] = hhmmMatch;
    const d = new Date();
    d.setHours(Number(hh), Number(mm), 0, 0);
    return d;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatTimeAgo(value) {
  const date = toDate(value);
  if (!date) return 'unknown';

  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 0) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs}h ago`;
}

export default function Timeline({ timelineEvents = [] }) {
  return (
    <Paper
      p="md"
      radius={8}
      style={{
        background: '#24263C',
        border: '1px solid #393C56',
      }}
    >
      <Text size="16px" fw={600} c="white" mb="sm">
        Activity Feed
      </Text>

      <Stack gap={0}>
        {timelineEvents.map((evt, i) => (
          <Group
            key={i}
            gap="sm"
            py={8}
            px={4}
            align="flex-start"
            wrap="nowrap"
            style={{
              borderBottom:
                i < timelineEvents.length - 1
                  ? '1px solid rgba(57,60,86,0.4)'
                  : 'none',
            }}
          >
            {/* Severity dot */}
            {EVENT_ICON[evt.type] ? (
              <img
                src={EVENT_ICON[evt.type]}
                alt={evt.type}
                style={{
                  width: 14,
                  height: 14,
                  marginTop: 3,
                  flexShrink: 0,
                }}
              />
            ) : (
              <Box
                mt={6}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: severityColor[evt.severity] || '#888F9E',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Content */}
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Group gap={6} mb={2}>
                <Text size="xs" c="#888F9E">
                  {evt.type}
                </Text>
                <Text size="xs" c="#888F9E">
                  · {formatTimeAgo(evt.time)}
                </Text>
              </Group>
              <Text size="sm" c="white" style={{ lineHeight: 1.4 }}>
                {evt.description}
              </Text>
            </Box>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
