import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import * as actions from '../actions/layout';

export const defaultState = {
  active: {},
};

export default handleActions(
  {
    [actions.setDragActiveState]: (state, { payload }) => {
      const { index, active } = payload;

      if (active) {
        return update(state, {
          active: {
            [index]: { $set: true },
          },
        });
      }

      return update(state, {
        active: { $unset: [index] },
      });
    },
  },
  defaultState,
);
