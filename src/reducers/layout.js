import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import R from 'ramda';

import { getAppState } from '../actions/startup';
import * as actions from '../actions/layout';

export const defaultState = {
  selectedGroup: null,
  cellGroup: null,
  reserved: {},
  active: {},
};

export default handleActions(
  {
    [actions.setDragActiveState]: (state, { payload }) =>
      update(state, {
        active: { $set: payload },
      }),

    [actions.createCellGroup]: (state, { payload }) =>
      update(state, {
        active: { $set: {} },
        cellGroup: {
          $set: {
            selected: payload,
            isNewGroup: true,
            groupId: null,
          },
        },
      }),

    [actions.selectGroup]: (state, { payload }) =>
      update(state, {
        cellGroup: {
          groupId: { $set: payload },
        },
      }),

    [actions.setGroupHover]: (state, { payload }) =>
      update(state, {
        selectedGroup: { $set: payload },
      }),

    [actions.editCellGroup]: (state, { payload }) => {
      const reserved = state.reserved[payload];

      return update(state, {
        selectedGroup: { $set: null },
        cellGroup: {
          $set: {
            groupId: reserved.group,
            isNewGroup: false,
            selected: null,
            id: payload,
          },
        },
      });
    },

    [actions.reportInvalidSelection]: state =>
      update(state, {
        active: { $set: {} },
      }),

    [actions.createGrouping]: state => {
      const { selected, groupId } = state.cellGroup;

      const fmt = (x, y) => `${x}:${y}`;
      const parse = index => index.split(':');
      const selectedCells = R.keys(selected).map(parse);

      // Locate the top-left index.
      const [x, y] = selectedCells.reduce((matching, pair) => {
        const [x, y] = pair;
        if (x <= matching[0] && y <= matching[1]) return pair;

        return matching;
      });

      const xs = new Set(selectedCells.map(R.prop(0)));
      const ys = new Set(selectedCells.map(R.prop(1)));

      return update(state, {
        cellGroup: { $set: null },
        reserved: {
          [fmt(x, y)]: {
            $set: {
              group: groupId,
              height: ys.size,
              width: xs.size,
              x: Number(x),
              y: Number(y),
            },
          },
        },
      });
    },

    [actions.updateGrouping]: state => {
      const { id, groupId } = state.cellGroup;

      return update(state, {
        cellGroup: { $set: null },
        reserved: {
          [id]: {
            $merge: { group: groupId },
          },
        },
      });
    },

    [actions.deleteGrouping]: state =>
      update(state, {
        reserved: { $unset: [state.cellGroup.id] },
        cellGroup: { $set: null },
      }),

    [getAppState]: (state, { payload }) => {
      const { layouts } = payload;
      if (!layouts) return state;

      return update(state, {
        reserved: { $set: layouts },
      });
    },
  },
  defaultState,
);
