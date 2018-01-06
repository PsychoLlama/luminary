import { View, Dimensions, StyleSheet } from 'react-native';
import React from 'react';

import LayoutOption from './LayoutOption';

const styles = StyleSheet.create({
  container: {},
});

export class LayoutManager extends React.Component {
  render() {
    const { rows, optionsPerRow, ...dimensions } = this.getDimensions();
    const totalOptions = rows * optionsPerRow;

    const options = Array(totalOptions)
      .fill(dimensions)
      .map(this.renderOption, this);

    return <View style={styles.container}>{options}</View>;
  }

  getDimensions() {
    const { width, height } = Dimensions.get('window');

    const optionsPerRow = 4;
    const size = width / optionsPerRow;

    const rows = Math.floor(height / size);
    const leftOver = height - rows * size;

    return {
      height: size + leftOver / rows,
      optionsPerRow,
      width: size,
      rows,
    };
  }

  // This would be so much easier with CSS grid.
  getLayout({ height, width }, id) {
    // Compensate for 0-based indexing.
    id += 1;

    const row = Math.ceil(id / 4);
    const col = id - (row - 1) * 4;

    return {
      left: (col - 1) * width,
      top: (row - 1) * height,
      height,
      width,
    };
  }

  renderOption(dimensions, id) {
    const layout = this.getLayout(dimensions, id);

    return <LayoutOption key={id} {...layout} />;
  }
}

export default LayoutManager;
