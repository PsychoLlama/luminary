import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';

import reducer from './reducers';

const middleware = applyMiddleware(promiseMiddleware);
export default createStore(reducer, middleware);
