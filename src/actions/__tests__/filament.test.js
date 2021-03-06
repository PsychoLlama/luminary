import { AsyncStorage } from 'react-native';
import axios from 'axios';
import R from 'ramda';

import * as actions from '../filament';

jest.mock('react-native');
jest.mock('axios');

jest.spyOn(AsyncStorage, 'getItem');
jest.spyOn(AsyncStorage, 'setItem');

jest.useFakeTimers();

const SERVER = 'http://server-url.tld';

describe('Filament', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const value = Promise.resolve(SERVER);
    AsyncStorage.getItem.mockReturnValue(value);
    AsyncStorage.setItem.mockReturnValue(Promise.resolve());

    const response = Promise.resolve({
      data: { app: 'filament' },
    });

    axios.get.mockReturnValue(response);
  });

  describe('pingServer', () => {
    const dispatch = R.identity;

    it('sends a network request', () => {
      expect(axios.get).not.toHaveBeenCalled();

      actions.pingServer('http://filament/?auth=potatoes')(dispatch);

      expect(axios.get).toHaveBeenCalledWith(
        'http://filament/status?auth=potatoes',
      );
    });

    it('returns the request promise', () => {
      const action = actions.pingServer('http://filament/')(dispatch);

      expect(action.payload).toEqual(expect.any(Promise));
    });

    it('saves the URL on success', async () => {
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      const url = '   http://filament/   ';
      const action = actions.pingServer(url)(dispatch);
      await action.payload;

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        actions.SERVER_URL_STORAGE_KEY,
        R.trim(url),
      );
    });

    it('throws if the response is invalid', async () => {
      const response = Promise.resolve({
        data: {
          app: 'not-filament',
        },
      });

      axios.get.mockReturnValue(response);
      const action = actions.pingServer('http://filament/')(dispatch);
      await expect(action.payload).rejects.toEqual(expect.any(Error));
    });

    it('resolves truthy if the ping was a success', async () => {
      const action = actions.pingServer('http://filament/')(dispatch);
      const result = await action.payload;

      expect(result).toEqual({ success: true });
    });

    it('fails after a timeout', async () => {
      const promise = new Promise(R.always(undefined));
      axios.get.mockReturnValue(promise);

      const action = actions.pingServer('http://filament/')(dispatch);
      jest.runOnlyPendingTimers();

      await expect(action.payload).rejects.toBeDefined();
    });
  });
});
