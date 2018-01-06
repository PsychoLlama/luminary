import { createAction } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import assert from 'minimalistic-assert';
import axios from 'axios';
import url from 'url';

import { optimistic } from '../utils/actions';

export const SERVER_URL_STORAGE_KEY = 'filament_server_url';
export const getServerUrl = optimistic('GET_SERVER_URL', () =>
  AsyncStorage.getItem(SERVER_URL_STORAGE_KEY),
);

export const pingServer = optimistic('PING_SERVER', async server => {
  const parsed = url.parse(server);
  parsed.pathname = '/status';
  const pingUrl = url.format(parsed);

  const { data } = await axios.get(pingUrl);
  assert(data && data.app === 'filament', 'Ping failed, bad server response.');

  await AsyncStorage.setItem(SERVER_URL_STORAGE_KEY, parsed.href);
});

export const updateServerUrl = createAction('UPDATE_SERVER_URL');
