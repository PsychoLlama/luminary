import { prefixActions } from '../utils/actions';

const createAction = prefixActions('SWITCHES');

export const toggleSwitch = createAction('TOGGLE_SWITCH');
