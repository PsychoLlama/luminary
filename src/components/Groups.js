import { gql, graphql } from 'react-apollo';
import { View, Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Group from './Group';

export class Groups extends Component {
  static propTypes = {
    data: PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.object),
      loading: PropTypes.bool.isRequired,
    }),
  }

  render() {
    const {loading, groups} = this.props.data;

    return (
      <View>
      {
        loading ? (
          <Text>Loading...</Text>
        ) : (
          groups.map(this.createGroup)
        )
      }
      </View>
    );
  }

  createGroup = (group) => (
    <Group key={group.id}>{group.name}</Group>
  )
}

const query = gql`query GetAllGroups {
  groups { name id }
}`;

export default graphql(query)(Groups);
