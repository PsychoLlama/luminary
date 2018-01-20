import { createAction } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import R from 'ramda';

import graphql from '../utils/graphql';

export const GROUPS_STORAGE_KEY = 'all_light_groups';
export const fetchAllGroups = createAction('FETCH_ALL_GROUPS', async server => {
  const api = graphql`
    query fetchAllGroups {
      groups {
        name
        id
        type
        anyOn
      }
    }
  `;

  const { groups } = await api(server);
  const normalized = R.indexBy(R.prop('id'), groups);
  const data = JSON.stringify(normalized);

  await AsyncStorage.setItem(GROUPS_STORAGE_KEY, data);

  return normalized;
});

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
