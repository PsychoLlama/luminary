import { View, StyleSheet } from 'react-native';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import * as actions from '../actions/groups';
import Group from './Group';

export const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
});

export class Groups extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.string),
    fetchAllGroups: PropTypes.func.isRequired,
    serverUrl: PropTypes.string.isRequired,
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
    const {groups} = this.props;

    return groups.map(this.createGroup);
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
