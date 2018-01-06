import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import * as colors from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.groups.bg,
    borderWidth: 0.5,
    borderColor: colors.groups.divider,
    position: 'absolute',
  },
});

export class LayoutOption extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  };

  render() {
    const { width, height, left, top } = this.props;
    const inline = { width, height, left, top };

    return <View style={[styles.container, inline]} />;
  }
}

export default LayoutOption;
