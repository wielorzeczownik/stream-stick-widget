import type { StreamElements } from '@tixyel/streamelements';
import { describe, expect, it } from 'vitest';

import { parseFields } from '@/fields';

type RawFields = Record<string, StreamElements.CustomField.Value>;

const parse = (raw: RawFields = {}) => parseFields(raw);

describe('parseFields defaults', () => {
  it('fills every field when the widget is configured with nothing', () => {
    expect(parse()).toEqual({
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
    });
  });

  it('falls back to the default when a number field is unparseable', () => {
    const config = parse({
      soundVolume: 'loud',
      pullDuration: 'quick',
      stickAngle: 'sideways',
    });

    expect(config.soundVolume).toBe(80);
    expect(config.pullDuration).toBe(3);
    expect(config.stickAngle).toBe(-65);
  });
});

describe('parseFields checkbox coercion', () => {
  it('treats an absent checkbox as enabled', () => {
    const config = parse();
    expect(config.enableCommand).toBe(true);
    expect(config.enableReward).toBe(true);
  });

  it.each([
    ['boolean false', false],
    ['the string "false"', 'false'],
  ])('treats %s as disabled', (_label, value) => {
    const config = parse({ enableCommand: value, enableReward: value });

    expect(config.enableCommand).toBe(false);
    expect(config.enableReward).toBe(false);
  });

  it('treats any other truthy-looking value as enabled', () => {
    expect(parse({ enableCommand: 'true' }).enableCommand).toBe(true);
  });
});

describe('parseFields clamping', () => {
  it.each([
    ['below the floor', -20, 0],
    ['above the ceiling', 250, 100],
    ['inside the range', 45, 45],
  ])('clamps soundVolume %s', (_label, input, expected) => {
    expect(parse({ soundVolume: input }).soundVolume).toBe(expected);
  });

  it('never lets pullDuration drop below one second', () => {
    // A zero-second pull would divide by zero in the tween scheduler.
    expect(parse({ pullDuration: 0 }).pullDuration).toBe(1);
    expect(parse({ pullDuration: -5 }).pullDuration).toBe(1);
  });

  it('allows a zero hold but not a negative one', () => {
    expect(parse({ holdDuration: 0 }).holdDuration).toBe(0);
    expect(parse({ holdDuration: -3 }).holdDuration).toBe(0);
  });

  it('never lets stickLength drop below the voxel floor', () => {
    // buildVoxelSprite divides stickLength by the sprite resolution; a tiny
    // length collapses every voxel into a degenerate box.
    expect(parse({ stickLength: 10 }).stickLength).toBe(100);
  });

  it('leaves stickAngle unclamped so the stick can point anywhere', () => {
    expect(parse({ stickAngle: -180 }).stickAngle).toBe(-180);
    expect(parse({ stickAngle: 180 }).stickAngle).toBe(180);
  });
});

describe('parseFields passthrough', () => {
  it('keeps user-supplied strings verbatim', () => {
    const config = parse({
      commandName: 'stick',
      rewardName: 'Yoink',
      stickColor: '#ff0000',
      customSkinUrl: 'https://example.invalid/skin.png',
      soundUrl: 'https://example.invalid/pop.mp3',
    });

    expect(config.commandName).toBe('stick');
    expect(config.rewardName).toBe('Yoink');
    expect(config.stickColor).toBe('#ff0000');
    expect(config.customSkinUrl).toBe('https://example.invalid/skin.png');
    expect(config.soundUrl).toBe('https://example.invalid/pop.mp3');
  });

  it('does not substitute a default for a deliberately blank command name', () => {
    // An empty string is a real value from the field editor, not an absence.
    expect(parse({ commandName: '' }).commandName).toBe('');
  });
});
