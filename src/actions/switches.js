import { AsyncStorage } from 'react-native';

import { prefixActions } from '../utils/actions';

const createAction = prefixActions('SWITCHES');

export const toggleSwitch = createAction('TOGGLE_SWITCH');

export const SWITCHES_STORAGE_KEY = 'feature_switches';
export const persistSwitches = () => async (dispatch, getState) => {
  const action = createAction('PERSIST_SWITCHES');

  const { switches } = getState();
  const persistable = JSON.stringify(switches);

  await AsyncStorage.setItem(SWITCHES_STORAGE_KEY, persistable);

  return action();
};
