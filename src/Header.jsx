import { Group, Text, Badge } from '@mantine/core';

export default function Header({ isLive, lastUpdated }) {
  const now = new Date();
  const formatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Group
      px="lg"
      py="sm"
      style={{
        background: '#24263C',
        borderBottom: '1px solid #393C56',
        borderRadius: '8px 8px 0 0',
      }}
    >
      <Group gap={8}>
        <Text
          size="lg"
          fw={700}
          variant="gradient"
          gradient={{ from: '#06b6d4', to: '#8b5cf6', deg: 135 }}
        >
          SYNMAX THEIA
        </Text>
        <Text size="lg" c="white" fw={300}>
          — Strait of Hormuz
        </Text>
      </Group>

      <Group ml="auto" gap="md">
        <Badge
          variant="dot"
          color={isLive ? 'green' : 'gray'}
          size="sm"
          styles={{ root: { background: '#1a1f2e', border: '1px solid #393C56' } }}
        >
          {isLive ? 'LIVE' : 'DEMO'}
        </Badge>
        <Text size="xs" c="#888F9E">
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : formatted}
        </Text>
      </Group>
    </Group>
  );
}
