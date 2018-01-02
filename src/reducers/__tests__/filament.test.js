import * as actions from '../../actions/filament';
import reducer, { STATES } from '../filament';

describe('server', () => {
  it('returns state when the action type is unknown', () => {
    const state = reducer(undefined, { type: 'who knows' });

    expect(state).toEqual({
      isValid: false,
      state: null,
      url: null,
    });
  });

  describe('getServerUrl', () => {
    it('updates the local server URL', () => {
      const url = 'http://server.com';
      const action = { payload: url, type: String(actions.getServerUrl) };
      const state = reducer(undefined, action);

      expect(state.url).toBe(url);
    });

    it('indicates the URL is valid', () => {
      const payload = 'http://server.url';
      const action = { payload, type: String(actions.getServerUrl) };
      const state = reducer(undefined, action);

      expect(state.isValid).toBe(true);
    });

    it('shows when the url was found', () => {
      const payload = 'http://server.url';
      const action = { payload, type: String(actions.getServerUrl) };
      const state = reducer(undefined, action);

      expect(state.state).toBe(STATES.FOUND);
    });

    it('shows when the url could not be found', () => {
      const payload = null;
      const action = { payload, type: String(actions.getServerUrl) };
      const state = reducer(undefined, action);

      expect(state.state).toBe(STATES.NOT_FOUND);
    });

    it('indicates when fetching from storage', () => {
      const action = { type: String(actions.getServerUrl.optimistic) };
      const state = reducer(undefined, action);

      expect(state.state).toBe(STATES.LOADING);
    });
  });
});
