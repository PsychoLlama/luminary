import { AsyncStorage } from 'react-native';

import * as actions from '../switches';

jest.spyOn(AsyncStorage, 'setItem');

describe('switches', () => {
  describe('persistSwitches', () => {
    beforeEach(() => {
      AsyncStorage.setItem.mockReturnValue(Promise.resolve());
    });

    it('writes feature switches to disk', async () => {
      const thunk = actions.persistSwitches();
      const switches = { dashboard: true, dragons: false };
      const getState = () => ({ switches });

      await thunk(jest.fn(), getState);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        actions.FEATURE_SWITCH_KEY,
        JSON.stringify(switches),
      );
    });

    it('resolves with an action', async () => {
      const thunk = actions.persistSwitches();
      const switches = { dashboard: true };
      const getState = () => ({ switches });

      const action = await thunk(jest.fn(), getState);

      expect(action).toEqual({ type: expect.any(String) });
    });
  });
});
