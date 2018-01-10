import { View, StyleSheet } from 'react-native';
import React from 'react';

import Layout from './Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class LayoutManager extends React.Component {
  state = { layout: null };

  render() {
    return (
      <View style={styles.container} onLayout={this.setDimensions}>
        <Layout {...this.props} container={this.state.layout} />
      </View>
    );
  }

  setDimensions = event => {
    const { layout } = event.nativeEvent;
    this.setState({ layout });
  };
}

export default LayoutManager;
