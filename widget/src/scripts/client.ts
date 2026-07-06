import Tixyel from '@tixyel/streamelements';

const WIDGET_ID = 'stick-out';

const client = new Tixyel.Client({
  id: WIDGET_ID,
  debug: import.meta.env.DEV,
});

export default client;
