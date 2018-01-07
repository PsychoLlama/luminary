import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import R from 'ramda';

import * as actions from '../actions/layout';

export const defaultState = {
  active: {},
};

export default handleActions(
  {
    [actions.setDragActiveState]: (state, { payload }) => {
      const removed = R.keys(R.filter(R.not, payload));
      const added = R.filter(R.identity, payload);

      return update(state, {
        active: {
          $unset: removed,
          $merge: added,
        },
      });
    },
  },
  defaultState,
);
