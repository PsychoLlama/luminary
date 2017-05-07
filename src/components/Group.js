import { View, Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Group extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
  }

  render() {
    return (
      <View>
        <Text>{this.props.children}</Text>
      </View>
    );
  }
}

export default Group;
