import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
  Text,
  View,
} from 'react-native';

import * as colors from '../constants/colors';
import * as actions from '../actions/layout';
import { selector } from '../utils/redux';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.groups.bg,
    flex: 1,
  },

  msg: {
    color: colors.text,
    fontSize: 20,
  },

  option: {
    borderColor: colors.groups.divider,
    backgroundColor: colors.groups.selected,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  radio: {
    borderRadius: 50,
    height: 16,
    width: 16,
    borderColor: colors.groups.radio,
    borderWidth: 1,
    marginRight: 16,
    padding: 2,
    marginLeft: 16,
  },

  selected: {
    flex: 1,
    backgroundColor: colors.groups.radio,
    borderRadius: 50,
  },

  buttons: {
    padding: 12,
  },
});

export class LayoutConfig extends React.Component {
  static propTypes = {
    createGrouping: PropTypes.func.isRequired,
    updateGrouping: PropTypes.func.isRequired,
    selectOption: PropTypes.func.isRequired,
    isNewGroup: PropTypes.bool,
    selected: PropTypes.string,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    selected: null,
  };

  static navigationOptions = {
    title: 'Choose a group',
  };

  render() {
    const { groups, selected } = this.props;
    const options = groups.map(this.renderOption, this);
    const confirmText = selected ? 'Create' : 'Select an option';

    return (
      <View style={styles.container}>
        <ScrollView>{options}</ScrollView>

        <View style={styles.buttons}>
          <Button
            disabled={!selected}
            title={confirmText}
            onPress={this.save}
          />
        </View>
      </View>
    );
  }

  renderOption({ id, name }) {
    const { selected } = this.props;

    return (
      <GroupOption
        onSelect={this.selectOption}
        selected={selected === id}
        title={name}
        key={id}
        id={id}
      />
    );
  }

  selectOption = groupId => {
    const { selected } = this.props;

    if (selected === groupId) {
      return;
    }

    this.props.selectOption(groupId);
  };

  save = () => {
    const { isNewGroup, createGrouping, updateGrouping } = this.props;

    const handler = isNewGroup ? createGrouping : updateGrouping;
    handler();

    this.props.navigation.goBack();
  };
}

export class GroupOption extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    title: PropTypes.string,
  };

  render() {
    const { selected, title } = this.props;

    return (
      <TouchableOpacity onPress={this.select}>
        <View style={styles.option}>
          <View style={styles.radio}>
            {selected && <View style={styles.selected} />}
          </View>

          <Text style={styles.msg}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  select = () => this.props.onSelect(this.props.id);
}

export const mapStateToProps = selector({
  isNewGroup: R.path(['layout', 'cellGroup', 'isNewGroup']),
  selected: R.path(['layout', 'cellGroup', 'groupId']),
  groups: createSelector(
    R.prop('groups'),
    R.pipe(R.values, R.filter(R.propEq('type', 'Room'))),
  ),
});

const mapDispatchToProps = {
  createGrouping: actions.createGrouping,
  updateGrouping: actions.updateGrouping,
  selectOption: actions.selectGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutConfig);
