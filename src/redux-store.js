import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import reducer from './reducers';

const middleware = applyMiddleware(thunkMiddleware, promiseMiddleware);
export default createStore(reducer, middleware);
