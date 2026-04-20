import type { StreamElements } from '@tixyel/streamelements';

import {
  DEFAULT_CENSOR_STYLE,
  DEFAULT_COMMAND,
  DEFAULT_HOLD_DURATION,
  DEFAULT_PULL_DURATION,
  DEFAULT_REWARD,
  DEFAULT_SOUND_VOLUME,
  DEFAULT_STICK_ANGLE,
  DEFAULT_STICK_COLOR,
  DEFAULT_STICK_LENGTH,
  DEFAULT_STICK_SKIN,
} from '@/constants';
import type { CensorStyle, Config, Skin } from '@/types';

export function parseFields(
  raw: Record<string, StreamElements.CustomField.Value>
): Config {
  const getString = (key: string, fallback = '') =>
    String(raw[key] ?? fallback);
  const getBoolean = (key: string, fallback: boolean) =>
    raw[key] === undefined
      ? fallback
      : raw[key] !== false && raw[key] !== 'false';
  const getNumber = (key: string, fallback: number) => {
    const parsed = Number(raw[key]);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  return {
    commandName: getString('commandName', DEFAULT_COMMAND),
    enableCommand: getBoolean('enableCommand', true),
    enableReward: getBoolean('enableReward', true),
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
