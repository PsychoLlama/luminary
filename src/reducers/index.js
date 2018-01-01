import { combineReducers } from 'redux';

import groups from './groups';

export default combineReducers({
  filamentServerUrl: (url = '') => url,
  groups,
});
