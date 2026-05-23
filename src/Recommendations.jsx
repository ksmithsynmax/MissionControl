import { Paper, Text, Stack, Group, Box } from '@mantine/core';

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
      <Text size="16px" fw={600} c="white" mb="sm">
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
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#006CD7';
              e.currentTarget.style.backgroundColor = 'rgba(0, 108, 215, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.backgroundColor = '#181926';
            }}
          >
            <Group mb={4}>
              <Text size="12px" fw={600} c="white">
                {rec.title}
              </Text>
            </Group>

            <Text size="10px" c="#888F9E" lineClamp={2} style={{ lineHeight: 1.45 }}>
              {rec.reason}
            </Text>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
