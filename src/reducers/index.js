import { combineReducers } from 'redux';

import filament from './filament';
import switches from './switches';
import groups from './groups';
import layout from './layout';

export default combineReducers({
  server: filament,
  switches,
  groups,
  layout,
});
