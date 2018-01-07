import { combineReducers } from 'redux';

import filament from './filament';
import groups from './groups';
import layout from './layout';

export default combineReducers({
  server: filament,
  groups,
  layout,
});
