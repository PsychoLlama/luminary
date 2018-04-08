import { AsyncStorage } from 'react-native';

import { prefixActions } from '../utils/actions';

const createAction = prefixActions('SWITCHES');

export const SWITCHES_STORAGE_KEY = 'feature_switches';
export const toggleSwitch = createAction('TOGGLE_SWITCH');
export const persistSwitches = createAction('PERSIST_SWITCHES', switches => {
  const persistable = JSON.stringify(switches);

  return AsyncStorage.setItem(SWITCHES_STORAGE_KEY, persistable);
});
