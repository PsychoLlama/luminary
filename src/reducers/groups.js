import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import { getAppState } from '../actions/startup';
import * as actions from '../actions/groups';

export default handleActions(
  {
    [actions.fetchAllGroups]: (state, action) => action.payload,
    [getAppState]: (state, action) => action.payload.groups,
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
