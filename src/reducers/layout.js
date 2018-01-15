import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import R from 'ramda';

import * as actions from '../actions/layout';

export const defaultState = {
  newCellGroup: null,
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
        newCellGroup: {
          $set: {
            selected: payload,
            groupId: null,
          },
        },
      }),

    [actions.selectGroup]: (state, { payload }) =>
      update(state, {
        newCellGroup: {
          groupId: { $set: payload },
        },
      }),

    [actions.setGroupHover]: (state, { payload }) =>
      update(state, {
        selectedGroup: { $set: payload },
      }),

    [actions.createGrouping]: state => {
      const { selected, groupId } = state.newCellGroup;

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
        newCellGroup: { $set: null },
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
  },
  defaultState,
);
