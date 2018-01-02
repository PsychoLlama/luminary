import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import * as actions from '../actions/filament';

const defaultState = {
  isValid: false,
  url: null,
};

export default handleActions({
  [actions.getServerUrl]: (state, action) => update(state, {
    url: { $set: action.payload },
    isValid: { $set: true },
  }),
}, defaultState);
