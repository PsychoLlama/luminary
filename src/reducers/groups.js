import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import { getAppState } from '../actions/startup';
import * as actions from '../actions/groups';

export default handleActions(
  {
    [getAppState]: (state, action) => action.payload.groups,
    [actions.fetchAllGroups]: {
      next: (state, action) => action.payload,
    },
    [actions.toggleLights]: (state, action) => {
      const { id, on } = action.payload;

      return update(state, {
        [id]: {
          anyOn: { $set: on },
        },
      });
    },
  },
  {},
);
