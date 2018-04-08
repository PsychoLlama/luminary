import { Switch, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import { DASHBOARD_MODE } from '../reducers/switches';
import * as actions from '../actions/switches';
import * as colors from '../constants/colors';
import { selector } from '../utils/redux';

const ListItem = styled.View`
  flex-direction: row;
  padding: 16px;
  background-color: ${colors.groups.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.groups.divider};
  justify-content: space-between;
`;

const OptionText = styled.Text`
  color: ${colors.text};
  font-size: 20px;
`;

export class AppSettings extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  static propTypes = {
    persistSwitches: PropTypes.func.isRequired,
    toggleSwitch: PropTypes.func.isRequired,
    switches: PropTypes.object.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  openLayoutManager = () => this.props.navigation.navigate('LayoutManager');

  setDashboardMode = enabled => {
    const { switches } = this.props;

    this.props.toggleSwitch({ name: DASHBOARD_MODE, on: enabled });
    this.props.persistSwitches({
      ...switches,
      [DASHBOARD_MODE]: !switches[DASHBOARD_MODE],
    });
  };

  render() {
    const { switches } = this.props;

    return (
      <ScrollView>
        <TouchableOpacity onPress={this.openLayoutManager}>
          <ListItem>
            <OptionText>Set group layout</OptionText>
          </ListItem>
        </TouchableOpacity>

        <ListItem>
          <OptionText>Dashboard mode</OptionText>
          <Switch
            onValueChange={this.setDashboardMode}
            value={switches[DASHBOARD_MODE]}
          />
        </ListItem>
      </ScrollView>
    );
  }
}

export const mapStateToProps = selector({
  switches: R.prop('switches'),
});

const mapDispatchToProps = {
  persistSwitches: actions.persistSwitches,
  toggleSwitch: actions.toggleSwitch,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
