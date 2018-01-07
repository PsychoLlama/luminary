import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import * as colors from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.groups.bg,
    borderWidth: 0.5,
    borderColor: colors.groups.divider,
    position: 'absolute',
  },

  selected: {
    backgroundColor: colors.groups.selected,
  },
});

export class LayoutOption extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    onLayout: PropTypes.func,
  };

  render() {
    const { width, height, left, top, active, onLayout } = this.props;
    const selectStyle = active && styles.selected;
    const inline = { width, height, left, top };

    return (
      <View
        onLayout={onLayout}
        style={[styles.container, selectStyle, inline]}
      />
    );
  }
}

export default LayoutOption;
