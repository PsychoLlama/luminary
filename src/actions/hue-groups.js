import { createAction } from 'redux-actions';

import graphql from '../utils/graphql';

export const fetchAllGroups = createAction('FETCH_ALL_GROUPS', graphql`
query fetchAllGroups {
  groups {
    name id type anyOn
  }
}
`);
