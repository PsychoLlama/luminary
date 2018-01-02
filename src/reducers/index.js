import { combineReducers } from 'redux';

import filament from './filament';
import groups from './groups';

export default combineReducers({
  server: filament,
  groups,
});
