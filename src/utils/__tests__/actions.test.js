import { optimistic } from '../actions';
import R from 'ramda';

describe('Action util', () => {
  beforeEach(() => jest.clearAllMocks());
  const dispatch = jest.fn(R.identity);

  describe('optimistic()', () => {
    it('dispatches immediately', () => {
      const action = optimistic('yolo');
      action()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: String(action.optimistic),
      });
    });

    it('string coerces to the action type', () => {
      const type = 'some-type';
      const action = optimistic(type);

      expect(String(action)).toBe(type);
    });

    it('string coerces to the optimistic type', () => {
      const type = 'RELEASE_KRAKEN';
      const action = optimistic(type);

      const coerced = String(action.optimistic);
      expect(coerced).toBe('optimistically(RELEASE_KRAKEN)');
    });

    it('includes the payload', () => {
      const action = optimistic('stuff');
      const payload = { value: 1 };
      action(payload)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: String(action.optimistic),
        payload,
      });
    });

    it('uses a list when multiple payloads are given', () => {
      const action = optimistic('things');
      action(1, 2)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: String(action.optimistic),
        payload: [1, 2],
      });
    });

    it('invokes the async creator', () => {
      const api = jest.fn();
      const action = optimistic('things', api);
      action(1, 2)(dispatch);

      expect(api).toHaveBeenCalledWith(1, 2);
    });

    it('returns the async action result', () => {
      const retVal = 'async action return';
      const api = jest.fn(() => retVal);
      const action = optimistic('stuff', api);
      const result = action()(dispatch);

      expect(result).toEqual(expect.objectContaining({
        payload: retVal,
      }));
    });
  });
});
