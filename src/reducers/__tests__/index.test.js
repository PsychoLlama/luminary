import reducer from '../index';

describe('The reducer entry point', () => {
  it('returns an initial state', () => {
    expect(reducer).toEqual(expect.any(Function));
    const state = reducer(undefined, { type: 'not_known_to_mankind' });

    expect(state).toEqual(expect.any(Object));
  });
});
