import { AsyncStorage } from 'react-native';

import * as actions from '../switches';

jest.spyOn(AsyncStorage, 'setItem');

describe('switches', () => {
  describe('persistSwitches', () => {
    beforeEach(() => {
      AsyncStorage.setItem.mockReturnValue(Promise.resolve());
    });

    it('writes feature switches to disk', async () => {
      const switches = { dashboard: true, dragons: false };
      const action = actions.persistSwitches(switches);
      await action.payload;

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        actions.SWITCHES_STORAGE_KEY,
        JSON.stringify(switches),
      );
    });
  });
});
