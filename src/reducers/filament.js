import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import * as actions from '../actions/filament';

export const STATES = {
  NOT_FOUND: 'not-found',
  LOADING: 'loading',
  FOUND: 'found',
};

const defaultState = {
  isValid: false,
  state: null,
  url: null,
};

export default handleActions({
  [actions.getServerUrl.optimistic]: state => update(state, {
    state: { $set: STATES.LOADING },
  }),

  [actions.getServerUrl]: (state, action) => update(state, {
    state: { $set: action.payload ? STATES.FOUND : STATES.NOT_FOUND },
    url: { $set: action.payload },
    isValid: { $set: true },
  }),

  [actions.updateServerUrl]: (state, action) => update(state, {
    url: { $set: action.payload },
  }),
}, defaultState);
