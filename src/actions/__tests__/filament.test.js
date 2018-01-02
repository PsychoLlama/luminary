import { AsyncStorage } from 'react-native';

import * as actions from '../filament';

jest.mock('react-native');
jest.spyOn(AsyncStorage, 'getItem');

const SERVER = 'http://server-url.tld';

describe('Filament', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const response = Promise.resolve(SERVER);
    AsyncStorage.getItem.mockReturnValue(response);
  });

  describe('getServerUrl', () => {
    it('returns a promise', () => {
      const result = actions.getServerUrl();

      expect(result.payload).toEqual(expect.any(Promise));
    });

    it('resolves with the storage data', async () => {
      const action = actions.getServerUrl();
      const result = await action.payload;

      expect(result).toBe(SERVER);
    });
  });
});