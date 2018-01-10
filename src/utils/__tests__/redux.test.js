import { selector } from '../redux';
import R from 'ramda';

describe('Redux utils', () => {
  describe('selector', () => {
    it('is a function', () => {
      expect(selector).toEqual(expect.any(Function));
    });

    it('returns a function', () => {
      const result = selector({});

      expect(result).toEqual(expect.any(Function));
    });

    it('invokes each subselector with the argument', () => {
      const field = jest.fn();
      const state = { state: true };
      const props = { props: true };
      const map = selector({ field });
      map(state, props);

      expect(field).toHaveBeenCalledWith(state, props);
    });

    it('computes the full state', () => {
      const map = selector({
        enabled: R.pipe(R.prop('enabled'), R.not),
        count: R.path(['active', 'count']),
      });

      const result = map({
        active: { count: 345876 },
        enabled: false,
      });

      expect(result).toEqual({
        enabled: true,
        count: 345876,
      });
    });
  });
});
