import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import url from 'url';
import R from 'ramda';

import { getAppState } from '../actions/startup';
import * as actions from '../actions/filament';

export const defaultState = {
  state: null,
  url: null,
};

// Indicate if the server was reachable.
const setPingFinishedState = R.curry((error, state) =>
  update(state, {
    testingConnection: { $set: false },
    pingSuccessful: { $set: !error },
  }),
);

export default handleActions(
  {
    [getAppState]: (state, { payload }) =>
      update(state, {
        url: { $set: payload.serverUrl },
        isValid: { $set: true },
      }),

    [actions.updateServerUrl]: (state, action) => {
      const parsed = url.parse(action.payload);
      const urlLooksValid = Boolean(parsed.protocol && parsed.host);

      return update(state, {
        urlLooksValid: { $set: urlLooksValid },
        url: { $set: action.payload },
        $unset: ['pingSuccessful'],
      });
    },

    [actions.pingServer.optimistic]: state =>
      update(state, {
        testingConnection: { $set: true },
      }),

    [actions.pingServer]: {
      throw: setPingFinishedState(true),
      next: setPingFinishedState(false),
    },
  },
  defaultState,
);
