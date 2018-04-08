import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import assert from 'minimalistic-assert';

import { getAppState } from '../actions/startup';
import * as actions from '../actions/switches';

export default handleActions(
  {
    [getAppState]: (state, action) => action.payload.switches || {},
    [actions.toggleSwitch]: (state, action) => {
      assert(
        state.hasOwnProperty(action.payload),
        `Switch "${action.payload}" doesn't exist.`,
      );

      return update(state, {
        [action.payload]: { $set: !state[action.payload] },
      });
    },
  },
  {},
);
