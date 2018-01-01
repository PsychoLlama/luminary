import * as actions from '../../actions/hue-groups';
import reducer from '../groups';

describe('groups', () => {
  it('provides a default state', () => {
    const state = reducer(undefined, { type: 'nothing' });

    expect(state).toEqual({});
  });

  it('returns state when the action has no match', () => {
    const state = {};
    const result = reducer(state, { type: 'unknown_type' });

    expect(result).toEqual(state);
  });

  describe('fetchAllGroups', () => {
    it('indexes groups by ID', () => {
      const groups = [{ id: '5', name: 'five' }, { id: '10', name: 'ten' }];
      const action = { type: actions.fetchAllGroups, payload: { groups } };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        5: groups[0],
        10: groups[1],
      });
    });

    it('replaces existing group state entirely', () => {
      const initial = { 5: { id: '5', name: 'five' } };
      const payload = { groups: [] };
      const action = { type: actions.fetchAllGroups, payload };
      const state = reducer(initial, action);

      expect(state).toEqual({});
    });
  });

  describe('toggleLights', () => {
    it('patches the group light state', () => {
      const id = '5';
      const initial = { [id]: { id, anyOn: true, name: 'Hall' } };
      const payload = { id, on: false };
      const action = { type: String(actions.toggleLights), payload };
      const state = reducer(initial, action);

      expect(state[id]).toEqual({
        ...initial[id],
        anyOn: false,
      });
    });
  });
});
