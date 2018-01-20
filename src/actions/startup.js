import { AsyncStorage } from 'react-native';
import R from 'ramda';

import { prefixActions } from '../utils/actions';

import { SERVER_URL_STORAGE_KEY } from './filament';
import { LAYOUT_STORAGE_KEY } from './layout';

const createAction = prefixActions('STARTUP');

export const getAppState = createAction('GET_APP_STATE', async () => {
  const data = await AsyncStorage.multiGet([
    SERVER_URL_STORAGE_KEY,
    LAYOUT_STORAGE_KEY,
  ]);

  const combine = (object, [key, value]) => R.assoc(key, value, object);
  const result = R.reduce(combine, {}, data);

  return {
    serverUrl: result[SERVER_URL_STORAGE_KEY],
    layouts: JSON.parse(result[LAYOUT_STORAGE_KEY]),
  };
});
