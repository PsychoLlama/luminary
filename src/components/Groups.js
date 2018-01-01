import { createSelector } from 'reselect';
import { View, Text } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Group from './Group';
import styles from './Groups.style';

const isRoom = (group) => group.type === 'Room';

export class Groups extends Component {
  static propTypes = {
    data: PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.string),
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
    const {groups, error} = this.props.data;

    if (error) {
      return this.renderError(error);
    }

    return groups.map(this.createGroup);
  }

  renderError(error) {
    return (
      <Text style={styles.error}>{error.message}</Text>
    );
  }

  createGroup = (groupId, index) => (
    <Group key={groupId} id={groupId} divide={index % 2 === 0} />
  );
}

const getGroupIds = createSelector(
  groups => groups,
  groups => Object
    .keys(groups)
    .map(key => groups[key])
    .filter(isRoom)
    .map(group => group.id)
);

export const mapStateToProps = (state) => ({
  groups: getGroupIds(state.groups),
});

export default connect(mapStateToProps)(Groups);
