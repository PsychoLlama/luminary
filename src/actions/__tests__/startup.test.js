import { AsyncStorage } from 'react-native';

import { SERVER_URL_STORAGE_KEY } from '../filament';
import { LAYOUT_STORAGE_KEY } from '../layout';
import * as actions from '../startup';

jest.spyOn(AsyncStorage, 'multiGet');

describe('Startup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppState', () => {
    let storage;

    beforeEach(() => {
      storage = {
        [SERVER_URL_STORAGE_KEY]: 'http://some.filament.url/',
        [LAYOUT_STORAGE_KEY]: JSON.stringify({
          '1:1': {
            group: '18',
            height: 1,
            width: 1,
            x: 1,
            y: 1,
          },
        }),
      };

      AsyncStorage.multiGet.mockImplementation(keys =>
        keys.map(key => [key, storage[key]]),
      );
    });

    it('creates a promise', () => {
      const action = actions.getAppState();

      expect(action.payload).toEqual(expect.any(Promise));
    });

    it('queries AsyncStorage', async () => {
      const action = actions.getAppState();

      await action.payload;

      expect(AsyncStorage.multiGet).toHaveBeenCalledWith(expect.any(Array));
    });

    it('returns the storage data', async () => {
      const action = actions.getAppState();
      const result = await action.payload;

      expect(result).toEqual({
        serverUrl: expect.any(String),
        layouts: expect.any(Object),
      });
    });

    it('does not splode if no layout data exists', async () => {
      storage[LAYOUT_STORAGE_KEY] = null;
      const action = actions.getAppState();
      const result = await action.payload;

      expect(result.layouts).toBe(null);
    });
  });
});
