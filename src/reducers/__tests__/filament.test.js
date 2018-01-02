import * as actions from '../../actions/filament';
import reducer from '../filament';

describe('server', () => {
  it('returns state when the action type is unknown', () => {
    const state = reducer(undefined, { type: 'who knows' });

    expect(state).toEqual({
      isValid: false,
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
  });
});
