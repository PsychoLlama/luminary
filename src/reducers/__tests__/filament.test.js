import reducer, { defaultState } from '../filament';
import { getAppState } from '../../actions/startup';
import * as actions from '../../actions/filament';

describe('server', () => {
  it('returns state when the action type is unknown', () => {
    const state = reducer(undefined, { type: 'who knows' });

    expect(state).toEqual({
      state: null,
      url: null,
    });
  });

  describe('getAppState', () => {
    it('updates the local server URL', () => {
      const payload = { serverUrl: 'http://server.com' };
      const action = { payload, type: String(getAppState) };
      const state = reducer(undefined, action);

      expect(state.url).toBe(payload.serverUrl);
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

      expect(state.pingSuccessful).toBe(true);
    });
  });
});
