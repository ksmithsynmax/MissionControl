import { Paper, Text, Stack, Group, Badge, Box } from '@mantine/core';

const urgencyColor = {
  HIGH: '#F75349',
  MEDIUM: '#FFA500',
  LOW: '#00A3E3',
};

export default function OpPriorities({ priorities = [] }) {
  return (
    <Paper
      p="md"
      radius={8}
      style={{ background: '#24263C', border: '1px solid #393C56' }}
    >
      <Text size="sm" fw={600} c="white" mb="sm">
        Operational Priorities
      </Text>

      <Stack gap={4}>
        {priorities.map((p) => (
          <Box
            key={p.id ?? p.priority ?? p.title}
            style={{
              background: '#181926',
              borderRadius: 6,
              border: '1px solid #393C56',
              padding: '10px 12px 12px',
            }}
          >
            <Group justify="space-between" mb={4}>
              <Group gap={6}>
                {p.priority ? (
                  <Text size="xs" fw={700} c="white">
                    {p.priority}
                  </Text>
                ) : null}
                <Text size="sm" fw={600} c="white">
                  {p.title}
                </Text>
              </Group>
              <Badge
                size="xs"
                variant="filled"
                color={urgencyColor[p.urgency]}
                styles={{
                  root: { textTransform: 'none' },
                }}
              >
                {p.urgency}
              </Badge>
            </Group>

            <Text size="xs" c="#888F9E" lineClamp={2} style={{ lineHeight: 1.45 }}>
              {p.description}
            </Text>

            <Group justify="space-between" mt={6}>
              <Text size="xs" c="#888F9E">
                Status: {p.status}
              </Text>
            </Group>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
