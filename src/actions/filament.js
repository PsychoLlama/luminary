import { createAction } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import assert from 'minimalistic-assert';
import axios from 'axios';
import url from 'url';

import { optimistic } from '../utils/actions';

export const SERVER_URL_STORAGE_KEY = 'filament_server_url';

const latencyTimeout = time =>
  new Promise((resolve, reject) =>
    setTimeout(reject, time, new Error('Request timed out.')),
  );

export const pingServer = optimistic('PING_SERVER', async server => {
  const parsed = url.parse(server);
  parsed.pathname = '/status';
  const pingUrl = url.format(parsed);

  const { data } = await Promise.race([
    latencyTimeout(5000),
    axios.get(pingUrl),
  ]);

  assert(data && data.app === 'filament', 'Ping failed, bad server response.');

  await AsyncStorage.setItem(SERVER_URL_STORAGE_KEY, parsed.href);

  return { success: true };
});

export const updateServerUrl = createAction('UPDATE_SERVER_URL');
