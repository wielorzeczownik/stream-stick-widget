import type { StreamElements } from '@tixyel/streamelements';

import type { CensorStyle, Config, Skin } from '@/types';

const DEFAULT_COMMAND = 'pull';
const DEFAULT_REWARD = 'Stick out';
const DEFAULT_PULL_DURATION = 3;
const DEFAULT_STICK_LENGTH = 300;
const DEFAULT_STICK_COLOR = '#8B4513';
const DEFAULT_STICK_ANGLE = -65;
const DEFAULT_STICK_SKIN = 'wood';
const DEFAULT_SOUND_VOLUME = 80;
const DEFAULT_HOLD_DURATION = 1.2;
const DEFAULT_CENSOR_STYLE = 'none';

export function parseFields(
  raw: Record<string, StreamElements.CustomField.Value>
): Config {
  const getString = (key: string, fallback = '') =>
    String(raw[key] ?? fallback);
  const isEnabled = (key: string, isEnabledByDefault: boolean) =>
    raw[key] === undefined
      ? isEnabledByDefault
      : raw[key] !== false && raw[key] !== 'false';
  const getNumber = (key: string, fallback: number) => {
    const parsed = Number(raw[key]);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  return {
    commandName: getString('commandName', DEFAULT_COMMAND),
    enableCommand: isEnabled('enableCommand', true),
    enableReward: isEnabled('enableReward', true),
    rewardName: getString('rewardName', DEFAULT_REWARD),
    soundUrl: getString('soundUrl'),
    soundVolume: Math.min(
      100,
      Math.max(0, getNumber('soundVolume', DEFAULT_SOUND_VOLUME))
    ),
    pullDuration: Math.max(1, getNumber('pullDuration', DEFAULT_PULL_DURATION)),
    holdDuration: Math.max(0, getNumber('holdDuration', DEFAULT_HOLD_DURATION)),
    stickLength: Math.max(100, getNumber('stickLength', DEFAULT_STICK_LENGTH)),
    stickColor: getString('stickColor', DEFAULT_STICK_COLOR),
    stickAngle: getNumber('stickAngle', DEFAULT_STICK_ANGLE),
    stickSkin: getString('stickSkin', DEFAULT_STICK_SKIN) as Skin,
    customSkinUrl: getString('customSkinUrl'),
    censorStyle: getString('censorStyle', DEFAULT_CENSOR_STYLE) as CensorStyle,
  };
}
