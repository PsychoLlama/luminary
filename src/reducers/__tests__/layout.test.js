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

    it('can mark indexes as inactive', () => {
      const index = '5:0';
      const initial = {
        ...defaultState,
        active: { [index]: true },
      };

      const action = actions.setDragActiveState({ [index]: false });
      const state = reducer(initial, action);

      expect(state.active).toEqual({});
    });

    it('can update many indexes simulaneously', () => {
      const initial = { ...defaultState, active: { '1:2': true } };
      const payload = { '1:1': true, '1:2': false, '1:3': true };
      const action = actions.setDragActiveState(payload);
      const state = reducer(initial, action);

      expect(state.active).toEqual({ '1:1': true, '1:3': true });
    });
  });
});
