import '@styles/dev-panel.scss';

import Tixyel from '@tixyel/streamelements';

import { COMMAND_PREFIX } from '@/constants';
import {
  setAngle,
  setCensorStyle,
  setCustomSkinUrl,
  setHoldDuration,
  setSkin,
  trigger,
} from '@/stick';
import type { CensorStyle, Config, Skin } from '@/types';

function emulateCommand(command: string): void {
  Tixyel.Local.emulate.twitch.message({
    name: 'testuser',
    userId: 'testuser',
    message: `${COMMAND_PREFIX}${command}`,
    badges: [],
  });
}

function emulateChannelPoints(rewardName: string): void {
  Tixyel.Local.emulate.send('onEventReceived', {
    provider: 'twitch',
    listener: 'event',
    event: {
      type: 'channelPointsRedemption',
      data: {
        amount: 1,
        quantity: 1,
        avatar: '',
        message: '',
        username: 'testuser',
        displayName: 'testuser',
        providerId: 'testuser',
        redemption: rewardName,
      },
    },
  } as unknown as Parameters<
    typeof Tixyel.Local.emulate.send<'onEventReceived'>
  >[1]);
}

export function initDevelopmentPanel(config: Config): void {
  const angleInput = document.getElementById(
    'dev-angle'
  ) as HTMLInputElement | null;
  const angleValue = document.getElementById(
    'dev-angle-value'
  ) as HTMLSpanElement | null;
  if (angleInput) {
    angleInput.value = String(config.stickAngle);
    if (angleValue) angleValue.textContent = `${config.stickAngle}°`;
    angleInput.addEventListener('input', () => {
      const deg = Number(angleInput.value);
      if (angleValue) angleValue.textContent = `${deg}°`;
      setAngle(deg);
    });
  }

  const customSkinInput = document.getElementById(
    'dev-custom-skin-url'
  ) as HTMLInputElement | null;

  const skinSelect = document.getElementById(
    'dev-skin'
  ) as HTMLSelectElement | null;
  if (skinSelect) {
    skinSelect.value = config.stickSkin;
    skinSelect.addEventListener('change', () => {
      if (skinSelect.value === 'custom' && customSkinInput) {
        setCustomSkinUrl(customSkinInput.value);
      }
      setSkin(skinSelect.value as Skin);
    });
  }

  if (customSkinInput) {
    customSkinInput.value = config.customSkinUrl;
    customSkinInput.addEventListener('change', () => {
      setCustomSkinUrl(customSkinInput.value);
      if (skinSelect?.value === 'custom') setSkin('custom');
    });
  }

  const holdInput = document.getElementById(
    'dev-hold-duration'
  ) as HTMLInputElement | null;
  if (holdInput) {
    holdInput.value = String(config.holdDuration);
    holdInput.addEventListener('input', () => {
      setHoldDuration(Math.max(0, Number(holdInput.value)));
    });
  }

  const censorSelect = document.getElementById(
    'dev-censor-style'
  ) as HTMLSelectElement | null;
  if (censorSelect) {
    censorSelect.value = config.censorStyle;
    censorSelect.addEventListener('change', () => {
      setCensorStyle(censorSelect.value as CensorStyle);
    });
  }

  document
    .querySelector('#dev-anim-direct')
    ?.addEventListener('click', () => trigger());

  document
    .querySelector('#dev-anim-command')
    ?.addEventListener('click', () => emulateCommand(config.commandName));

  document
    .querySelector('#dev-anim-points')
    ?.addEventListener('click', () => emulateChannelPoints(config.rewardName));
}
