import { createAction } from 'redux-actions';
import assert from 'minimalistic-assert';

export const optimistic = (type, api) => {
  const optimisticType = `optimistically(${type})`;
  const optimisticAction = createAction(optimisticType);
  const asyncAction = createAction(type, api);

  const creator = (...args) => dispatch => {
    const values = args.length;
    const payload = values === 1 ? args[0] : args;
    const action = optimisticAction(values ? payload : undefined);

    dispatch(action);

    return dispatch(asyncAction(...args));
  };

  // For handleActions compatibility.
  creator.toString = () => type;
  creator.optimistic = {
    toString: () => optimisticType,
  };

  return creator;
};

export const prefixActions = (prefix, factory = createAction) => {
  assert(typeof prefix === 'string', 'The prefix is required.');

  return (type, ...args) => factory(`${prefix}___${type}`, ...args);
};
