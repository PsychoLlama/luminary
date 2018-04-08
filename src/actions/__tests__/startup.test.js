import { AsyncStorage } from 'react-native';

import { SERVER_URL_STORAGE_KEY } from '../filament';
import { SWITCHES_STORAGE_KEY } from '../switches';
import { GROUPS_STORAGE_KEY } from '../groups';
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
        [GROUPS_STORAGE_KEY]: JSON.stringify({
          1: { id: '1', name: 'One', type: 'Room', anyOn: false },
          2: { id: '2', name: 'Two', type: 'Room', anyOn: false },
        }),
        [SWITCHES_STORAGE_KEY]: JSON.stringify({
          dashboard: true,
        }),
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
        switches: expect.any(Object),
        layouts: expect.any(Object),
        groups: expect.any(Object),
      });
    });

    it('does not splode if no layout data exists', async () => {
      storage[LAYOUT_STORAGE_KEY] = null;
      const action = actions.getAppState();
      const result = await action.payload;

      expect(result.layouts).toBe(null);
    });

    it('does not splode if no group data exists', async () => {
      storage[GROUPS_STORAGE_KEY] = null;
      const action = actions.getAppState();
      const result = await action.payload;

      expect(result.groups).toBe(null);
    });

    it('does not splode if no switch data exists', async () => {
      storage[SWITCHES_STORAGE_KEY] = null;
      const action = actions.getAppState();
      const result = await action.payload;

      expect(result.switches).toBe(null);
    });
  });
});
