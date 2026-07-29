import type { Config } from '@/types';

export function makeConfig(overrides: Partial<Config> = {}): Config {
  return {
    commandName: 'pull',
    enableCommand: true,
    enableReward: true,
    rewardName: 'Stick out',
    soundUrl: '',
    soundVolume: 80,
    pullDuration: 3,
    holdDuration: 1.2,
    stickLength: 300,
    stickColor: '#8B4513',
    stickAngle: -65,
    stickSkin: 'wood',
    customSkinUrl: '',
    censorStyle: 'none',
    ...overrides,
  };
}
