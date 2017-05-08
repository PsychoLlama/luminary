import { gql, graphql } from 'react-apollo';
import { View, Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Group from './Group';
import styles from './Groups.style';

const isRoom = (group) => group.type === 'Room';

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
      <View style={styles.container}>
      {
        loading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          groups.filter(isRoom).map(this.createGroup)
        )
      }
      </View>
    );
  }

  createGroup = (group, index) => (
    <Group key={group.id} group={group} divide={index % 2 === 0} />
  );
}

const query = gql`query GetAllGroups {
  groups {
    name id type state {
      any_on
    }
  }
}`;

export default graphql(query)(Groups);
