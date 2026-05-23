import { Group, Paper, Text, Stack, Box } from '@mantine/core';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

function KpiSparkline({ points, color, id }) {
  const data = points.map((value, idx) => ({ idx, value }));

  return (
    <Box style={{ width: '100%', height: 30 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`${id}-stroke`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="50%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.55} />
            </linearGradient>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={`url(#${id}-stroke)`}
            fill={`url(#${id}-fill)`}
            strokeWidth={2}
            fillOpacity={1}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

function getTrend(points) {
  const baseline = points[0] ?? 0;
  const current = points[points.length - 1] ?? 0;
  const delta = current - baseline;

  if (baseline === 0) {
    if (current === 0) {
      return { arrow: '—', pctText: '0%', color: '#888F9E' };
    }
    return { arrow: '↑', pctText: '100%', color: '#00EB6C' };
  }

  const pct = Math.round((Math.abs(delta) / baseline) * 100);
  if (delta > 0) return { arrow: '↑', pctText: `${pct}%`, color: '#00EB6C' };
  if (delta < 0) return { arrow: '↓', pctText: `${pct}%`, color: '#F75349' };
  return { arrow: '—', pctText: '0%', color: '#888F9E' };
}

export default function KpiRow({ vessels = [], timelineEvents = [] }) {
  const darkVessels = vessels.filter((v) => v.status === 'Dark').length;
  const activeSts = vessels.filter((v) => v.status === 'STS Transfer').length / 2;
  const activeAlerts = timelineEvents.filter((e) => e.severity === 'critical').length;

  const kpis = [
    {
      label: 'Vessels Tracked',
      value: vessels.length,
      sparkColor: '#00EB6C',
      points: [10, 11, 11, 12, 12, 13, 12, 13, 14, vessels.length],
    },
    {
      label: 'Dark Vessels',
      value: darkVessels,
      sparkColor: '#FFA500',
      points: [1, 1, 2, 2, 3, 2, 3, 2, 2, darkVessels],
    },
    {
      label: 'Active STS',
      value: activeSts,
      sparkColor: '#00EB6C',
      points: [0, 1, 1, 2, 1, 2, 1, 2, 1, activeSts],
    },
    {
      label: 'Active Alerts',
      value: activeAlerts,
      sparkColor: '#F75349',
      points: [2, 3, 3, 4, 3, 4, 5, 4, 5, activeAlerts],
    },
  ];

  return (
    <Group grow wrap="nowrap" align="stretch" gap={8} style={{ width: '100%' }}>
      {kpis.map((kpi) => {
        const trend = getTrend(kpi.points);

        return (
          <Paper
            key={kpi.label}
            p="md"
            radius={8}
            style={{
              background: '#24263C',
              border: '1px solid #393C56',
              minWidth: 0,
              height: '100%',
              display: 'flex',
            }}
          >
            <Stack style={{ width: '100%', flex: 1 }} gap={6}>
              <Box style={{ display: 'flex', gap: 16 }}>
                <Text size={'34px'} fw={600} c="white">
                  {kpi.value}
                </Text>
                <Box>
                  <Text size="xs" c="white" style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    {kpi.label}
                  </Text>
                  <Text size="xs" c="#888F9E">
                    Last 24h
                  </Text>
                </Box>
              </Box>
              <KpiSparkline
                points={kpi.points}
                color={kpi.sparkColor}
                id={`kpi-${kpi.label.toLowerCase().replace(/\s+/g, '-')}`}
              />
              <Text size="xs" fw={600} c={trend.color}>
                {trend.arrow} {trend.pctText}{' '}
                <span style={{ color: '#ffffff', fontWeight: 400 }}>vs yesterday</span>
              </Text>
            </Stack>
          </Paper>
        );
      })}
    </Group>
  );
}
