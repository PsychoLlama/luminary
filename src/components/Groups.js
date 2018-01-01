import { View, Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Group from './Group';
import styles from './Groups.style';

const isRoom = (group) => group.type === 'Room';

export class Groups extends Component {
  static propTypes = {
    data: PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        anyOn: PropTypes.bool,
        id: PropTypes.string,
      })),
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string,
      }),
    }),
  }

  render() {
    return (
      <View style={styles.container}>{this.renderContent()}</View>
    );
  }

  renderContent() {
    const {loading, groups, error} = this.props.data;

    if (error) {
      return this.renderError(error);
    }

    if (loading) {
      return <Text style={styles.loading}>Loading...</Text>;
    }

    return groups.filter(isRoom).map(this.createGroup);
  }

  renderError(error) {
    return (
      <Text style={styles.error}>{error.message}</Text>
    );
  }

  createGroup = (group, index) => (
    <Group key={group.id} group={group} divide={index % 2 === 0} />
  );
}

export default Groups;
