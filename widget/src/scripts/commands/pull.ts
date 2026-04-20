import Tixyel, { type StreamElements } from '@tixyel/streamelements';

import client from '@/client';
import { COMMAND_PREFIX } from '@/constants';
import { trigger } from '@/stick';
import type { Config } from '@/types';

export function initPull(config: Config): void {
  if (config.enableCommand) {
    void new Tixyel.actions.Command({
      prefix: COMMAND_PREFIX,
      name: config.commandName,
      description: 'Pull the stick',
      arguments: false,
      run: () => trigger(),
    });
  }

  client.on('event', (provider, event) => {
    if (!config.enableReward || provider !== 'twitch') return;

    const twitchEvent = event as StreamElements.Event.Provider.Twitch.Event;
    if (twitchEvent.listener !== 'event') return;

    const inner = twitchEvent.event;
    if (inner.type !== 'channelPointsRedemption') return;
    if (inner.data.redemption !== config.rewardName) return;

    trigger();
  });

  void new Tixyel.actions.Button({
    field: 'btnTestAnimation',
    name: 'Test animation',
    run: () => trigger(),
  });
}
