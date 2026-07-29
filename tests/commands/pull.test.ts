import { makeConfig } from '@tests/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initPull } from '@/commands/pull';

const { mockTrigger, mockClientOn } = vi.hoisted(() => ({
  mockTrigger: vi.fn(),
  mockClientOn: vi.fn(),
}));

vi.mock('@/stick', () => ({ trigger: mockTrigger }));
vi.mock('@/client', () => ({ default: { on: mockClientOn } }));

const { MockCommand, MockButton } = vi.hoisted(() => ({
  MockCommand: vi.fn(),
  MockButton: vi.fn(),
}));
vi.mock('@tixyel/streamelements', () => ({
  default: {
    Client: vi.fn(),
    actions: { Command: MockCommand, Button: MockButton },
    logger: { success: vi.fn(), debug: vi.fn() },
    SeAPI: Promise.resolve({ sendMessage: vi.fn() }),
  },
  StreamElements: {},
}));

type EventHandler = (provider: string, event: unknown) => void;

function setup(config = makeConfig()) {
  initPull(config);
  const handler = mockClientOn.mock.calls.find(
    ([name]) => name === 'event'
  )?.[1] as EventHandler;
  return { handler };
}

function redemption(name: string) {
  return {
    listener: 'event',
    event: {
      type: 'channelPointsRedemption',
      data: { redemption: name },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('chat command registration', () => {
  it('registers the command under the configured name', () => {
    setup(makeConfig({ commandName: 'stick' }));

    expect(MockCommand).toHaveBeenCalledOnce();
    expect(MockCommand.mock.calls[0][0]).toMatchObject({
      name: 'stick',
      prefix: '!',
    });
  });

  it('does not register the command when it is disabled', () => {
    setup(makeConfig({ enableCommand: false }));
    expect(MockCommand).not.toHaveBeenCalled();
  });

  it('triggers the stick when the command runs', () => {
    setup();
    const { run } = MockCommand.mock.calls[0][0] as { run: () => void };
    run();
    expect(mockTrigger).toHaveBeenCalledOnce();
  });

  it('always registers the test button so the field editor stays usable', () => {
    // The button lives in the widget editor, not in chat, so it must survive
    // both the command and the reward being switched off.
    setup(makeConfig({ enableCommand: false, enableReward: false }));
    expect(MockButton).toHaveBeenCalledOnce();
    expect(MockButton.mock.calls[0][0]).toMatchObject({
      field: 'btnTestAnimation',
    });
  });
});

describe('channel points redemption', () => {
  it('triggers on a matching reward name from twitch', () => {
    const { handler } = setup(makeConfig({ rewardName: 'Stick out' }));
    handler('twitch', redemption('Stick out'));
    expect(mockTrigger).toHaveBeenCalledOnce();
  });

  it('ignores a reward whose name does not match exactly', () => {
    const { handler } = setup(makeConfig({ rewardName: 'Stick out' }));
    handler('twitch', redemption('stick out'));
    handler('twitch', redemption('Stick out!'));
    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it.each(['youtube', 'kick'])(
    'ignores redemptions relayed from %s',
    (provider) => {
      // Channel Points are Twitch-only; a lookalike payload from another
      // provider must not drive the animation.
      const { handler } = setup();
      handler(provider, redemption('Stick out'));
      expect(mockTrigger).not.toHaveBeenCalled();
    }
  );

  it('ignores redemptions when the reward is disabled', () => {
    const { handler } = setup(makeConfig({ enableReward: false }));
    handler('twitch', redemption('Stick out'));
    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it('ignores twitch events that are not redemptions', () => {
    const { handler } = setup();
    handler('twitch', {
      listener: 'event',
      event: { type: 'follow', data: {} },
    });
    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it('ignores events from a listener other than "event"', () => {
    const { handler } = setup();
    handler('twitch', {
      listener: 'event:test',
      event: { type: 'channelPointsRedemption', data: { redemption: 'x' } },
    });
    expect(mockTrigger).not.toHaveBeenCalled();
  });
});
