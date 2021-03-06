import { getAppState } from '../../actions/startup';
import * as actions from '../../actions/groups';
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

  describe('getAppState', () => {
    it('replaces the current state', () => {
      const payload = {
        groups: {
          1: { id: '1', name: 'One', type: 'Room', anyOn: false },
        },
      };

      const state = reducer({}, { type: String(getAppState), payload });

      expect(state).toEqual(payload.groups);
    });
  });

  describe('fetchAllGroups', () => {
    it('indexes groups by ID', () => {
      const groups = {
        10: { id: '10', name: 'ten' },
        5: { id: '5', name: 'five' },
      };

      const action = { type: actions.fetchAllGroups, payload: groups };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        10: groups[10],
        5: groups[5],
      });
    });

    it('replaces existing group state entirely', () => {
      const initial = { 5: { id: '5', name: 'five' } };
      const action = { type: actions.fetchAllGroups, payload: {} };
      const state = reducer(initial, action);

      expect(state).toEqual({});
    });

    it('ignores errored requests', () => {
      const initial = { 5: { id: '5', name: 'five' } };
      const action = { type: actions.fetchAllGroups, error: true };
      const state = reducer(initial, action);

      expect(state).toEqual(initial);
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
