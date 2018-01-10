import R from 'ramda';

export const selector = fields => {
  const pairs = R.toPairs(fields);

  return (state, props) =>
    pairs.reduce((result, [prop, selector]) => {
      const value = selector(state, props);
      return R.assoc(prop, value, result);
    }, {});
};
