import { createAction } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import url from 'url';

import { optimistic } from '../utils/actions';

export const getServerUrl = optimistic('GET_SERVER_URL', () => (
  AsyncStorage.getItem('filament_server_url')
));

export const pingServer = optimistic('PING_SERVER', server => {
  const parsed = url.parse(server);
  parsed.pathname = '/status';
  const pingUrl = url.format(parsed);

  return axios.get(pingUrl);
});

export const updateServerUrl = createAction('UPDATE_SERVER_URL');
