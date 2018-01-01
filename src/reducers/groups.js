import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import * as actions from '../actions/hue-groups';

export default handleActions({
  [actions.fetchAllGroups]: (state, action) => {
    const indexById = (groups, group) => update(groups, {
      [group.id]: { $set: group },
    });

    return action.payload.reduce(indexById, {});
  },
}, {});
