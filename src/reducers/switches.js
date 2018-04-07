import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import assert from 'minimalistic-assert';

import * as actions from '../actions/switches';

export default handleActions(
  {
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
