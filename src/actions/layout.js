import { prefixActions } from '../utils/actions';

const createAction = prefixActions('LAYOUT');

export const setDragActiveState = createAction('SET_DRAG_ACTIVE_STATE');
export const createCellGroup = createAction('CREATE_CELL_GROUP');
export const selectGroup = createAction('SELECT_LIGHT_GROUP');
export const createGrouping = createAction('CREATE_GROUPING');
