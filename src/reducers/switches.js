import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import assert from 'minimalistic-assert';

import { getAppState } from '../actions/startup';
import * as actions from '../actions/switches';

export const DASHBOARD_MODE = 'dashboardMode';
export const DEFAULT_STATE = {
  [DASHBOARD_MODE]: false,
};

export default handleActions(
  {
    [getAppState]: (state, action) => action.payload.switches || DEFAULT_STATE,
    [actions.toggleSwitch]: (state, action) => {
      const { name, on } = action.payload;

      assert(
        state.hasOwnProperty(action.payload.name),
        `Switch "${name}" doesn't exist.`,
      );

      return update(state, {
        [name]: { $set: on },
      });
    },
  },
  DEFAULT_STATE,
);
