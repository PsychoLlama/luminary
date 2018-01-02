import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import reducer from './reducers';

// This needs to be pulled from AsyncStorage and added via the UI.
// It will work for now though.
const SERVER_URL = 'http://192.168.0.27/';

const middleware = applyMiddleware(thunkMiddleware, promiseMiddleware);
const initialState = {
  server: {
    url: SERVER_URL,
  },
  groups: {},
};

export default createStore(reducer, initialState, middleware);
