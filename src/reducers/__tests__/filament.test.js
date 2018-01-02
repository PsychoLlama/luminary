import * as actions from '../../actions/filament';
import reducer, { STATES, defaultState } from '../filament';

describe('server', () => {
  it('returns state when the action type is unknown', () => {
    const state = reducer(undefined, { type: 'who knows' });

    expect(state).toEqual({
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

  describe('updateServerUrl', () => {
    it('sets the server URL', () => {
      const url = 'https://bacon.yolo';
      const action = actions.updateServerUrl(url);
      const state = reducer(undefined, action);

      expect(state).toMatchObject({ url });
    });

    it('indicates if the URL looks invalid', () => {
      const action = actions.updateServerUrl('invalid');
      const state = reducer(undefined, action);

      expect(state.urlLooksValid).toBe(false);
    });

    it('indicates if the URL looks valid', () => {
      const action = actions.updateServerUrl('http://server/');
      const state = reducer(undefined, action);

      expect(state.urlLooksValid).toBe(true);
    });

    it('resets the ping success state', () => {
      const initial = { ...defaultState, pingSuccessful: false };
      const action = actions.updateServerUrl('http://different/');
      const state = reducer(initial, action);

      expect(state.pingSuccessful).toBeUndefined();
    });
  });

  describe('pingServer', () => {
    it('optimistically sets a "ping in progress" flag', () => {
      const action = { type: String(actions.pingServer.optimistic) };
      const state = reducer(undefined, action);

      expect(state.testingConnection).toBe(true);
    });

    it('unsets the ping flag when finished', () => {
      const action = { type: String(actions.pingServer) };
      const state = reducer(undefined, action);

      expect(state.testingConnection).toBe(false);
      expect(state.pingSuccessful).toBe(true);
    });

    it('indicates if the ping failed', () => {
      const action = { type: String(actions.pingServer), error: true };
      const state = reducer(undefined, action);

      expect(state.pingSuccessful).toBe(false);
    });

    it('updates the server state', () => {
      const action = { type: String(actions.pingServer) };
      const state = reducer(undefined, action);

      expect(state.state).toBe(STATES.FOUND);
    });
  });
});
