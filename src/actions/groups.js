import { createAction } from 'redux-actions';

import graphql from '../utils/graphql';

export const fetchAllGroups = createAction(
  'FETCH_ALL_GROUPS',
  graphql`
    query fetchAllGroups {
      groups {
        name
        id
        type
        anyOn
      }
    }
  `,
);

export const toggleLights = createAction(
  'TOGGLE_GROUP_LIGHTS',
  (server, vars) => {
    const api = graphql`
      mutation changeGroupOnOffState($id: ID!, $on: Boolean!) {
        setGroupState(id: $id, state: { on: $on }) {
          id
          anyOn
        }
      }
    `;

    api(server, vars);

    return vars;
  },
);
