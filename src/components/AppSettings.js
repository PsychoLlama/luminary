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
import Icon from './common/Icon';

const ListItem = styled.View`
  flex-direction: row;
  padding: 16px;
  background-color: ${colors.groups.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.groups.divider};
  justify-content: space-between;
`;

const FONT_SIZE = 20;
const OptionText = styled.Text`
  color: ${colors.text};
  font-size: ${FONT_SIZE}px;
`;

const SettingsIcon = styled(Icon).attrs({
  color: colors.settings.icon,
  size: FONT_SIZE,
})``;

const Description = styled.View`
  flex-direction: row;
  align-items: center;
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
  openServerConfig = () =>
    this.props.navigation.navigate('ServerLink', {
      goBack: true,
    });

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
            <Description>
              <SettingsIcon name="th" />
              <OptionText>Change layout</OptionText>
            </Description>
          </ListItem>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.openServerConfig}>
          <ListItem>
            <Description>
              <SettingsIcon name="wifi" />
              <OptionText>Change server URL</OptionText>
            </Description>
          </ListItem>
        </TouchableOpacity>

        <ListItem>
          <Description>
            <SettingsIcon name="dashboard" />
            <OptionText>Dashboard mode</OptionText>
          </Description>
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
