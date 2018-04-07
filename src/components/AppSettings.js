import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import React from 'react';

import * as colors from '../constants/colors';

const ListItem = styled.View`
  flex-direction: row;
  padding: 16px;
  background-color: ${colors.groups.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.groups.divider};
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
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  openLayoutManager = () => this.props.navigation.navigate('LayoutManager');

  render() {
    return (
      <ScrollView>
        <TouchableOpacity onPress={this.openLayoutManager}>
          <ListItem>
            <OptionText>Set group layout</OptionText>
          </ListItem>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default AppSettings;
