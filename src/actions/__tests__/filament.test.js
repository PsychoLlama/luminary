import { AsyncStorage } from 'react-native';
import axios from 'axios';
import R from 'ramda';

import * as actions from '../filament';

jest.mock('react-native');
jest.mock('axios');

jest.spyOn(AsyncStorage, 'getItem');
const SERVER = 'http://server-url.tld';

describe('Filament', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const value = Promise.resolve(SERVER);
    AsyncStorage.getItem.mockReturnValue(value);

    axios.get.mockReturnValue(Promise.resolve());
  });

  describe('getServerUrl', () => {
    const dispatch = R.identity;

    it('returns a promise', () => {
      const result = actions.getServerUrl()(dispatch);

      expect(result.payload).toEqual(expect.any(Promise));
    });

    it('resolves with the storage data', async () => {
      const action = actions.getServerUrl()(dispatch);
      const result = await action.payload;

      expect(result).toBe(SERVER);
    });
  });

  describe('pingServer', () => {
    const dispatch = R.identity;

    it('sends a network request', () => {
      expect(axios.get).not.toHaveBeenCalled();

      actions.pingServer('http://filament/?auth=potatoes')(dispatch);

      expect(axios.get).toHaveBeenCalledWith(
        'http://filament/status?auth=potatoes'
      );
    });

    it('returns the request promise', () => {
      const action = actions.pingServer('http://filament/')(dispatch);

      expect(action.payload).toEqual(expect.any(Promise));
    });
  });
});
