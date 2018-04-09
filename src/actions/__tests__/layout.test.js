// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid, AsyncStorage } from 'react-native';
import R from 'ramda';

import * as actions from '../layout';

jest.spyOn(AsyncStorage, 'getItem');
jest.spyOn(AsyncStorage, 'setItem');
jest.spyOn(ToastAndroid, 'show');

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const response = Promise.resolve(null);

    AsyncStorage.getItem.mockReturnValue(response);
    AsyncStorage.setItem.mockReturnValue(response);

    ToastAndroid.show.mockReturnValue(undefined);
    ToastAndroid.SHORT = 500;
  });

  describe('reportInvalidSelection', () => {
    it('shows a message', () => {
      actions.reportInvalidSelection();

      expect(ToastAndroid.show).toHaveBeenCalledWith(
        expect.any(String),
        ToastAndroid.SHORT,
      );
    });
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
});
