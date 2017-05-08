/* eslint-disable camelcase */
import { View, Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Group.style';

export class Group extends Component {
  static propTypes = {
    divide: PropTypes.bool,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      state: PropTypes.shape({
        any_on: PropTypes.bool,
      }).isRequired,
    }).isRequired,
  }

  render() {
    const { group, divide } = this.props;
    const online = group.state.any_on ? styles.on : styles.off;
    const style = [styles.title];

    if (divide) {
      style.push(styles.divide);
    }

    return (
      <View style={styles.container}>
        <Text style={style}>
          {this.props.group.name}
        </Text>

        <View style={[styles.status, online]} />
      </View>
    );
  }
}

export default Group;
