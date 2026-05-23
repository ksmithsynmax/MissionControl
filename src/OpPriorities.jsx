import { useState } from 'react';
import { Paper, Text, Stack, Group, Badge, Box, ActionIcon } from '@mantine/core';
import STSIcon from './assets/icons/STSIcon.svg';
import SpoofingPositionIcon from './assets/icons/SpoofingPositionIcon.svg';
import DarkIcon from './assets/icons/DarkIcon.svg';
import ZombieShipIcon from './assets/icons/ZombieShip.svg';
import AisIcon from './assets/icons/AisIcon.svg';

const urgencyColor = {
  HIGH: '#F75349',
  MEDIUM: '#FFA500',
  LOW: '#00EB6C',
};

function splitPriorityTitle(title) {
  const rawTitle = String(title || '').trim();
  if (!rawTitle) return { eventLabel: 'Priority Event', vesselLabel: 'Unknown vessel' };

  const parts = rawTitle.split(/\s[—-]\s/);
  if (parts.length >= 2) {
    return {
      eventLabel: parts[0].trim(),
      vesselLabel: parts.slice(1).join(' - ').trim(),
    };
  }

  return { eventLabel: rawTitle, vesselLabel: 'Active target' };
}

function getPriorityIcon(priority) {
  const context = `${priority?.title || ''} ${priority?.description || ''}`.toLowerCase();

  if (context.includes('sts')) return STSIcon;
  if (context.includes('spoof')) return SpoofingPositionIcon;
  if (context.includes('dark')) return DarkIcon;
  if (context.includes('sanction')) return ZombieShipIcon;
  return AisIcon;
}

export default function OpPriorities({ priorities = [] }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleDetails = (itemKey) => {
    setExpandedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  return (
    <Paper
      p="md"
      radius={8}
      style={{ background: '#24263C', border: '1px solid #393C56' }}
    >
      <Text size="16px" fw={600} c="white" mb="sm">
        Operational Priorities
      </Text>

      <Stack gap={4}>
        {priorities.map((p) => {
          const { eventLabel, vesselLabel } = splitPriorityTitle(p.title);
          const iconSrc = getPriorityIcon(p);
          const urgency = p.urgency || 'LOW';
          const itemKey = p.id ?? p.priority ?? p.title;
          const isExpanded = Boolean(expandedItems[itemKey]);

          return (
            <Box
              key={itemKey}
              style={{
                background: '#15172A',
                borderRadius: 8,
                border: '1px solid transparent',
                padding: '10px 10px 9px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#006CD7';
                e.currentTarget.style.backgroundColor = 'rgba(0, 108, 215, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.backgroundColor = '#15172A';
              }}
            >
              <Group justify="space-between" align="flex-start" mb={4} wrap="nowrap">
                <Group gap={9} wrap="nowrap" style={{ minWidth: 0 }}>
                  <Box
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 4,
                      background: '#24263C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt={eventLabel}
                      style={{ width: 14, height: 14, display: 'block' }}
                    />
                  </Box>
                  <Box style={{ minWidth: 0 }}>
                    <Text size="12px" fw={600} c="white" lineClamp={1} style={{ lineHeight: 1.15 }}>
                      {eventLabel}
                    </Text>
                    <Text size="10px" c="#888F9E" lineClamp={1} style={{ letterSpacing: 0.2, marginTop: 2 }}>
                      {vesselLabel}
                    </Text>
                  </Box>
                </Group>
                <Group gap={6} wrap="nowrap">
                  <Badge
                    size="sm"
                    variant="filled"
                    styles={{
                      root: {
                        backgroundColor: urgencyColor[urgency],
                        textTransform: 'none',
                        fontWeight: 700,
                        letterSpacing: 0.3,
                        width: 74,
                        justifyContent: 'center',
                      },
                      label: {
                        color: urgency === 'MEDIUM' || urgency === 'HIGH' || urgency === 'LOW' ? '#111326' : '#ffffff',
                      },
                    }}
                  >
                    {urgency}
                  </Badge>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    onClick={() => toggleDetails(itemKey)}
                    styles={{
                      root: {
                        color: '#ffffff',
                        width: 22,
                        height: 22,
                      },
                    }}
                  >
                    <Box
                      component="svg"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      style={{
                        width: 14,
                        height: 14,
                        display: 'block',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 140ms ease',
                      }}
                    >
                      <path
                        d="M4 6.5L8 10.5L12 6.5"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Box>
                  </ActionIcon>
                </Group>
              </Group>

              <Box
                style={{
                  display: 'grid',
                  gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  opacity: isExpanded ? 1 : 0,
                  transition: 'grid-template-rows 260ms ease, opacity 200ms ease',
                  marginTop: isExpanded ? 6 : 0,
                  willChange: 'grid-template-rows, opacity',
                }}
              >
                <Box
                  style={{
                    overflow: 'hidden',
                    transform: isExpanded ? 'translateY(0)' : 'translateY(-3px)',
                    transition: 'transform 220ms ease',
                  pointerEvents: isExpanded ? 'auto' : 'none',
                  }}
                >
                  <Text size="xs" c="#888F9E" style={{ lineHeight: 1.4 }}>
                    {p.description || 'No details available.'}
                  </Text>
                  <Group mt={8} gap={4}>
                    <Text size="9px" c="#5F667A" fw={600} tt="uppercase" style={{ letterSpacing: 0.45 }}>
                      Status
                    </Text>
                    <Text size="9px" c="#888F9E" fw={500} tt="uppercase" style={{ letterSpacing: 0.35 }}>
                      {p.status || 'Unknown'}
                    </Text>
                  </Group>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
