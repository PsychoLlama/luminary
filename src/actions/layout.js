// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid, AsyncStorage } from 'react-native';

import { prefixActions } from '../utils/actions';

const createAction = prefixActions('LAYOUT');

export const setDragActiveState = createAction('SET_DRAG_ACTIVE_STATE');
export const createCellGroup = createAction('CREATE_CELL_GROUP');
export const selectGroup = createAction('SELECT_LIGHT_GROUP');
export const setGroupHover = createAction('SELECT_GROUPING');
export const createGrouping = createAction('CREATE_GROUPING');
export const deleteGrouping = createAction('DELETE_GROUPING');
export const updateGrouping = createAction('UPDATE_GROUPING');
export const editCellGroup = createAction('EDIT_GROUPING');

export const reportInvalidSelection = createAction(
  'REPORT_INVALID_SELECTION',
  () => {
    ToastAndroid.show(`Groups can't overlap.`, ToastAndroid.SHORT);
  },
);

export const LAYOUT_STORAGE_KEY = 'groups_layout';
export const persistLayouts = () => (dispatch, getState) => {
  const layouts = JSON.stringify(getState().layout.reserved);

  const persist = () => AsyncStorage.setItem(LAYOUT_STORAGE_KEY, layouts);
  const action = createAction('PERSIST', persist);

  return dispatch(action());
};
