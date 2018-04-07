import { AsyncStorage } from 'react-native';

import { prefixActions } from '../utils/actions';

const createAction = prefixActions('SWITCHES');

export const toggleSwitch = createAction('TOGGLE_SWITCH');

export const FEATURE_SWITCH_KEY = 'feature_switches';
export const persistSwitches = () => async (dispatch, getState) => {
  const action = createAction('PERSIST_SWITCHES');

  const { switches } = getState();
  const persistable = JSON.stringify(switches);

  await AsyncStorage.setItem(FEATURE_SWITCH_KEY, persistable);

  return action();
};
