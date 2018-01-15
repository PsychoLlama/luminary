import { AsyncStorage } from 'react-native';
import R from 'ramda';

import * as actions from '../layout';

jest.spyOn(AsyncStorage, 'getItem');
jest.spyOn(AsyncStorage, 'setItem');

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const response = Promise.resolve(null);

    AsyncStorage.getItem.mockReturnValue(response);
    AsyncStorage.setItem.mockReturnValue(response);
  });

  describe('persistLayouts', () => {
    const dispatch = jest.fn(R.identity);

    it('saves the layouts to disk', async () => {
      const reserved = {
        '1:1': { x: 1, y: 1, width: 1, height: 1, group: '5' },
      };

      const getState = jest.fn().mockReturnValue({ layout: { reserved } });
      const result = actions.persistLayouts()(dispatch, getState);

      expect(dispatch).toHaveBeenCalled();
      expect(result.payload).toEqual(expect.any(Promise));
      await result.payload;

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        actions.LAYOUT_STORAGE_KEY,
        JSON.stringify(reserved),
      );
    });

    it('rejects if the save fails', async () => {
      const error = new Error('Testing layout persist failure');
      const failure = Promise.reject(error);
      AsyncStorage.setItem.mockReturnValue(failure);

      const layout = { reserved: {} };
      const getState = jest.fn().mockReturnValue({ layout });
      const result = actions.persistLayouts()(dispatch, getState);

      await expect(result.payload).rejects.toBe(error);
    });
  });

  describe('getLayouts', () => {
    it('loads all layouts', async () => {
      const action = actions.getLayouts();

      expect(action.payload).toEqual(expect.any(Promise));
      const result = await action.payload;

      expect(result).toBe(null);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        actions.LAYOUT_STORAGE_KEY,
      );
    });

    it('parses the result if it exists', async () => {
      const reserved = {
        '1:1': { x: 1, y: 1, width: 1, height: 1, group: '5' },
      };

      const response = Promise.resolve(JSON.stringify(reserved));
      AsyncStorage.getItem.mockReturnValue(response);

      const action = actions.getLayouts();
      const result = await action.payload;

      expect(result).toEqual(reserved);
    });
  });
});
