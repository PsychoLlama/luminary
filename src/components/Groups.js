import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import * as colors from '../constants/colors';
import * as actions from '../actions/groups';
import { selector } from '../utils/redux';
import Group from './Group';

export const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },

  editButtonContainer: {
    marginRight: 16,
  },

  editButton: {
    color: colors.navbar.text,
    fontSize: 18,
  },
});

export class Groups extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.string),
    fetchAllGroups: PropTypes.func.isRequired,
    serverUrl: PropTypes.string.isRequired,
  };

  static navigationOptions = props => ({
    title: 'Groups',
    headerRight: (
      <TouchableOpacity
        title="Edit"
        onPress={() => props.navigation.navigate('LayoutManager')}
      >
        <View style={styles.editButtonContainer}>
          <Text style={styles.editButton}>Edit</Text>
        </View>
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    this.props.fetchAllGroups(this.props.serverUrl);
  }

  render() {
    return <View style={styles.container}>{this.renderContent()}</View>;
  }

  renderContent() {
    const { groups } = this.props;

    return groups.map(this.createGroup);
  }

  createGroup = (groupId, index) => (
    <Group key={groupId} id={groupId} divide={index % 2 === 0} />
  );
}

export const mapStateToProps = selector({
  serverUrl: R.path(['server', 'url']),
  groups: createSelector(
    R.prop('groups'),
    R.pipe(R.values, R.filter(R.propEq('type', 'Room')), R.map(R.prop('id'))),
  ),
});

const mapDispatchToProps = {
  fetchAllGroups: actions.fetchAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
