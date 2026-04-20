import Tixyel from '@tixyel/streamelements';

import client from '@/client';
import { initPull } from '@/commands/pull';
import { parseFields } from '@/fields';
import { init } from '@/stick';

if (import.meta.env.DEV) {
  void Tixyel.Local.start();
}

client.on('load', () => {
  const config = parseFields(client.fields);
  init(config);
  initPull(config);

  if (import.meta.env.DEV) {
    void import('@/development-panel').then(({ initDevelopmentPanel }) =>
      initDevelopmentPanel(config)
    );
  }
});
