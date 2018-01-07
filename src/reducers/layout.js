import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import R from 'ramda';

import * as actions from '../actions/layout';

export const defaultState = {
  newCellGroup: null,
  active: {},
};

export default handleActions(
  {
    [actions.setDragActiveState]: (state, { payload }) => {
      const removed = R.keys(R.filter(R.equals(false), payload));
      const added = R.filter(R.identity, payload);

      return update(state, {
        active: {
          $unset: removed,
          $merge: added,
        },
      });
    },

    [actions.createCellGroup]: (state, { payload }) =>
      update(state, {
        active: { $set: {} },
        newCellGroup: {
          $set: {
            selected: payload,
          },
        },
      }),
  },
  defaultState,
);
