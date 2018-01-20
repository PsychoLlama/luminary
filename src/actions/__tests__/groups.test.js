import { AsyncStorage } from 'react-native';
import R from 'ramda';

import graphql from '../../utils/graphql';
import * as actions from '../groups';

jest.spyOn(AsyncStorage, 'setItem');
jest.mock('../../utils/graphql');

describe('Hue Group action', () => {
  const query = jest.fn(() => Promise.resolve());
  const groups = [
    { id: '3', name: 'Kitchen', type: 'Room', anyOn: true },
    { id: '5', name: 'Hall', type: 'Room', anyOn: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    graphql.mockReturnValue(query);
    query.mockReturnValue({ groups });
  });

  describe('toggleLights', () => {
    it('exists', () => {
      expect(actions.toggleLights).toEqual(expect.any(Function));
    });

    it('sends an API request', () => {
      actions.toggleLights('http://filament/');

      expect(query).toHaveBeenCalled();
    });

    it('returns an optimistic payload', () => {
      const variables = { id: '5', on: true };
      const action = actions.toggleLights('http://filament/', variables);

      expect(action.payload).toEqual(variables);
    });
  });

  describe('fetchAllGroups', () => {
    beforeEach(() => {
      const response = Promise.resolve();

      AsyncStorage.setItem.mockReturnValue(response);
    });

    it('retrieves all the groups', () => {
      actions.fetchAllGroups('http://filament/');

      expect(query).toHaveBeenCalled();
    });

    it('persists the groups', async () => {
      const action = actions.fetchAllGroups('http://filament/');

      expect(action.payload).toEqual(expect.any(Promise));
      await action.payload;

      const expected = R.indexBy(R.prop('id'), groups);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        actions.GROUPS_STORAGE_KEY,
        JSON.stringify(expected),
      );
    });

    it('returns the normalized group data', async () => {
      const action = actions.fetchAllGroups('http://filament/');
      const result = await action.payload;

      expect(result).toEqual(R.indexBy(R.prop('id'), groups));
    });
  });
});
