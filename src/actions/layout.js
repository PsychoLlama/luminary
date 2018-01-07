import { prefixActions } from '../utils/actions';

const createAction = prefixActions('LAYOUT');

export const setDragActiveState = createAction('SET_DRAG_ACTIVE_STATE');
export const createCellGroup = createAction('CREATE_CELL_GROUP');
