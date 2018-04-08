import reducer, { DEFAULT_STATE } from '../switches';
import { getAppState } from '../../actions/startup';
import * as actions from '../../actions/switches';

describe('switches', () => {
  it('provides default state', () => {
    const state = reducer(undefined, { type: 'unknown' });

    expect(state).toEqual(DEFAULT_STATE);
  });

  it('can toggle switches', () => {
    const action = actions.toggleSwitch({ name: 'dashboard', on: true });
    const state = reducer({ dashboard: false }, action);

    expect(state).toEqual({
      dashboard: true,
    });
  });

  it('merges in other state', () => {
    const initial = { dashboard: false, dragons: true };
    const action = actions.toggleSwitch({ name: 'dashboard', on: true });
    const state = reducer(initial, action);

    const { dashboard, ...untouched } = initial;
    expect(state).toMatchObject(untouched);
  });

  // Protects against typos.
  it('throws if the switch is undefined', () => {
    const payload = { name: 'no-such-key', on: false };
    const action = actions.toggleSwitch(payload);
    const fail = () => reducer({}, action);

    expect(fail).toThrow(
      expect.objectContaining({
        message: expect.stringMatching(payload.name),
      }),
    );
  });

  describe('getAppState', () => {
    it('hydrates the switches', () => {
      const switches = { dashboard: true };
      const action = { type: String(getAppState), payload: { switches } };
      const state = reducer(undefined, action);

      expect(state).toEqual(switches);
    });

    it('initializes the switches when none exist', () => {
      const switches = null;
      const action = { type: String(getAppState), payload: { switches } };
      const state = reducer(undefined, action);

      expect(state).toEqual(DEFAULT_STATE);
    });
  });
});
