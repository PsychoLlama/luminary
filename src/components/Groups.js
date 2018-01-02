import { createSelector } from 'reselect';
import { View, Text } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../actions/groups';
import styles from './Groups.style';
import Group from './Group';
import R from 'ramda';

export class Groups extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.string),
    fetchAllGroups: PropTypes.func.isRequired,
    serverUrl: PropTypes.string.isRequired,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
  }

  componentDidMount() {
    this.props.fetchAllGroups(this.props.serverUrl);
  }

  render() {
    return (
      <View style={styles.container}>{this.renderContent()}</View>
    );
  }

  renderContent() {
    const {groups, error} = this.props;

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

const isRoom = R.compose(R.equals('Room'), R.prop('type'));
const getGroupIds = createSelector(
  groups => groups,
  groups => Object
    .keys(groups)
    .map(key => groups[key])
    .filter(isRoom)
    .map(group => group.id)
);

export const mapStateToProps = (state) => ({
  serverUrl: R.path(['server', 'url'], state),
  groups: getGroupIds(state.groups),
});

const mapDispatchToProps = {
  fetchAllGroups: actions.fetchAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
