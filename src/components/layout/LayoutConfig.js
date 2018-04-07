import { TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import * as colors from '../../constants/colors';
import * as actions from '../../actions/layout';
import { selector } from '../../utils/redux';

const Container = styled.View`
  background-color: ${colors.groups.bg};
  flex: 1;
`;

const GroupName = styled.Text`
  color: ${colors.text};
  font-size: 20px;
`;

const Option = styled.View`
  background-color: ${colors.groups.selected};
  border: 1px solid ${colors.groups.divider};
  border-left-width: 0;
  border-right-width: 0;
  height: 75px;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const Buttons = styled.View`
  flex-direction: row;
`;

const Radio = styled.View`
  border-radius: 50;
  height: 16px;
  width: 16px;
  border: 1px solid ${colors.groups.radio};
  margin: 0 16px;
  padding: 2px;
`;

const InnerRadio = styled.View`
  flex: 1;
  background-color: ${colors.groups.radio};
  border-radius: 50;
`;

const ButtonWrapper = styled.View`
  flex: 1;
  padding: 12px;
`;

export const SaveButton = styled.Button``;
export const DeleteButton = styled.Button.attrs({ color: colors.error })``;

export class LayoutConfig extends React.Component {
  static propTypes = {
    createGrouping: PropTypes.func.isRequired,
    deleteGrouping: PropTypes.func.isRequired,
    persistLayouts: PropTypes.func.isRequired,
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
    const { groups, selected, isNewGroup } = this.props;
    const options = groups.map(this.renderOption, this);
    const newGroupConfirmText = selected ? 'Create' : 'Select an option';
    const confirmText = isNewGroup ? newGroupConfirmText : 'Update';

    return (
      <Container>
        <ScrollView>{options}</ScrollView>

        <Buttons>
          {!isNewGroup && (
            <ButtonWrapper>
              <DeleteButton title="Delete" onPress={this.delete} />
            </ButtonWrapper>
          )}

          <ButtonWrapper>
            <SaveButton
              disabled={!selected}
              title={isNewGroup ? confirmText : 'update'}
              onPress={this.save}
            />
          </ButtonWrapper>
        </Buttons>
      </Container>
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
    this.props.persistLayouts();

    this.props.navigation.goBack();
  };

  delete = () => {
    this.props.deleteGrouping();
    this.props.persistLayouts();
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
        <Option>
          <Radio>{selected && <InnerRadio />}</Radio>

          <GroupName>{title}</GroupName>
        </Option>
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
  deleteGrouping: actions.deleteGrouping,
  persistLayouts: actions.persistLayouts,
  updateGrouping: actions.updateGrouping,
  selectOption: actions.selectGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutConfig);
