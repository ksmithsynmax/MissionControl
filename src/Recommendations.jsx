import { Paper, Text, Stack, Group, Badge, Box } from '@mantine/core';

const tagColor = {
  Suggested: '#006CD7',
  Proactive: '#FFA500',
  'Due Today': '#F75349',
  'New Intel': '#00A3E3',
  Backlog: '#888F9E',
};

export default function Recommendations({ recommendations = [] }) {
  return (
    <Paper
      p="md"
      radius={8}
      style={{
        background: '#24263C',
        border: '1px solid #393C56',
        flex: 1,
      }}
    >
      <Text size="sm" fw={600} c="white" mb="sm">
        Recommended For You
      </Text>

      <Stack gap={4}>
        {recommendations.map((rec) => (
          <Box
            key={rec.title}
            p="sm"
            style={{
              background: '#181926',
              borderRadius: 6,
              border: '1px solid #393C56',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#006CD7';
              e.currentTarget.style.backgroundColor = 'rgba(0, 108, 215, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#393C56';
              e.currentTarget.style.backgroundColor = '#181926';
            }}
          >
            <Group justify="space-between" mb={4}>
              <Group gap={6}>
                <Text size="sm" fw={600} c="white">
                  {rec.title}
                </Text>
              </Group>
              <Badge
                size="xs"
                variant="light"
                styles={{
                  root: {
                    background: `${tagColor[rec.tag]}20`,
                    border: `1px solid ${tagColor[rec.tag]}40`,
                    textTransform: 'none',
                  },
                  label: { color: tagColor[rec.tag] },
                }}
              >
                {rec.tag}
              </Badge>
            </Group>

            <Text size="xs" c="#888F9E" lineClamp={2} style={{ lineHeight: 1.45 }}>
              {rec.reason}
            </Text>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
