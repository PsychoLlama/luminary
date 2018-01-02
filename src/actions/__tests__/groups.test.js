import axios from 'axios';

import * as actions from '../groups';

jest.mock('axios');

describe('Hue Group action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toggleLights', () => {
    it('exists', () => {
      expect(actions.toggleLights).toEqual(expect.any(Function));
    });

    it('sends an API request', () => {
      actions.toggleLights('http://filament/');

      expect(axios.post).toHaveBeenCalled();
    });

    it('returns an optimistic payload', () => {
      const variables = { id: '5', on: true };
      const action = actions.toggleLights('http://filament/', variables);

      expect(action.payload).toEqual(variables);
    });
  });
});
