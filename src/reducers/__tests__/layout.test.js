import reducer, { defaultState } from '../layout';
import * as actions from '../../actions/layout';

describe('Layout', () => {
  it('returns state when unrecognized actions pass through', () => {
    const state = {};
    const result = reducer(state, { type: 'who knows' });

    expect(result).toBe(state);
  });

  describe('setDragActiveState', () => {
    it('can mark indexes as active', () => {
      const action = actions.setDragActiveState({ '0:1': true });
      const state = reducer(undefined, action);

      expect(state.active).toEqual({ '0:1': true });
    });

    it('removes old indices', () => {
      const index = '5:0';
      const initial = {
        ...defaultState,
        active: { [index]: true },
      };

      const action = actions.setDragActiveState({ '5:1': true });
      const state = reducer(initial, action);

      expect(state.active).toEqual({ '5:1': true });
    });

    it('can update many indexes simulaneously', () => {
      const initial = { ...defaultState, active: { '1:2': true } };
      const payload = { '1:1': true, '1:3': true };
      const action = actions.setDragActiveState(payload);
      const state = reducer(initial, action);

      expect(state.active).toEqual({ '1:1': true, '1:3': true });
    });
  });

  describe('createCellGroup', () => {
    it('removes all active cells', () => {
      const active = { '1:1': true, '1:2': true };
      const initial = { ...defaultState, active };
      const action = actions.createCellGroup(active);
      const state = reducer(initial, action);

      expect(state.active).toEqual({});
    });

    it('sets a flag', () => {
      const active = { '1:1': true, '2:1': true };
      const action = actions.createCellGroup(active);
      const state = reducer(undefined, action);

      expect(state.newCellGroup).toMatchObject({
        selected: active,
      });
    });
  });

  describe('selectGroup', () => {
    it('marks the group ID as selected', () => {
      const id = '18';
      const createCellGroup = actions.createCellGroup({});
      const initial = reducer(undefined, createCellGroup);
      const action = actions.selectGroup(id);
      const state = reducer(initial, action);

      expect(state.newCellGroup.groupId).toBe(id);
    });
  });

  describe('createGrouping', () => {
    it('removes intermediate grouping state', () => {
      const selected = { '0:0': true };
      const createCellGroup = actions.createCellGroup(selected);
      const done = actions.createGrouping();

      const cellGroupings = reducer(undefined, createCellGroup);
      const state = reducer(cellGroupings, done);

      expect(state.newCellGroup).toBe(null);
    });

    it('adds a reserved slot', () => {
      const id = '8';
      const selected = { '1:1': true, '1:2': true };
      const create = actions.createCellGroup(selected);
      const initial = reducer(undefined, create);
      const identified = reducer(initial, actions.selectGroup(id));
      const state = reducer(identified, actions.createGrouping());

      expect(state.reserved).toEqual({
        '1:1': {
          group: id,
          height: 2,
          width: 1,
          x: 1,
          y: 1,
        },
      });
    });
  });
});
