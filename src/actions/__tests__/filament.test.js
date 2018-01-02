import { AsyncStorage } from 'react-native';
import axios from 'axios';
import R from 'ramda';

import * as actions from '../filament';

jest.mock('react-native');
jest.mock('axios');

jest.spyOn(AsyncStorage, 'getItem');
jest.spyOn(AsyncStorage, 'setItem');
const SERVER = 'http://server-url.tld';

describe('Filament', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const value = Promise.resolve(SERVER);
    AsyncStorage.getItem.mockReturnValue(value);
    AsyncStorage.setItem.mockReturnValue(Promise.resolve());

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

    it('saves the URL on success', async () => {
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      const url = 'http://filament/';
      const action = actions.pingServer(url)(dispatch);
      await action.payload;

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.any(String),
        url
      );
    });
  });
});
