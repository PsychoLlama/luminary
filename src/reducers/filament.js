import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import url from 'url';
import R from 'ramda';

import * as actions from '../actions/filament';

export const STATES = {
  NOT_FOUND: 'not-found',
  LOADING: 'loading',
  FOUND: 'found',
};

const defaultState = {
  state: null,
  url: null,
};

// Indicate if the server was reachable.
const setPingFinishedState = R.curry((error, state) => update(state, {
  testingConnection: { $set: false },
  pingSuccessful: { $set: !error },
}));

export default handleActions({
  [actions.getServerUrl.optimistic]: state => update(state, {
    state: { $set: STATES.LOADING },
  }),

  [actions.getServerUrl]: (state, action) => update(state, {
    state: { $set: action.payload ? STATES.FOUND : STATES.NOT_FOUND },
    url: { $set: action.payload },
    isValid: { $set: true },
  }),

  [actions.updateServerUrl]: (state, action) => {
    const parsed = url.parse(action.payload);
    const urlLooksValid = Boolean(parsed.protocol && parsed.host);

    return update(state, {
      urlLooksValid: { $set: urlLooksValid },
      url: { $set: action.payload },
    });
  },

  [actions.pingServer.optimistic]: state => update(state, {
    testingConnection: { $set: true },
  }),

  [actions.pingServer]: {
    throw: setPingFinishedState(true),
    next: state => {
      const patched = setPingFinishedState(false, state);

      return update(patched, {
        state: { $set: STATES.FOUND },
      });
    },
  },
}, defaultState);
