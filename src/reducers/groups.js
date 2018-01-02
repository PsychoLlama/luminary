import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import * as actions from '../actions/groups';

export default handleActions({
  [actions.fetchAllGroups]: (state, action) => {
    const indexById = (groups, group) => update(groups, {
      [group.id]: { $set: group },
    });

    return action.payload.groups.reduce(indexById, {});
  },

  [actions.toggleLights]: (state, action) => {
    const { id, on } = action.payload;

    return update(state, {
      [id]: {
        anyOn: { $set: on },
      },
    });
  },
}, {});
