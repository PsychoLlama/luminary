import { View, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import React from 'react';

import LayoutManager from './src/components/LayoutManager';
import * as colors from './src/constants/colors';
import store from './src/redux-store';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appBackground,
    height: '100%',
  },
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar hidden />
          <LayoutManager />
        </View>
      </Provider>
    );
  }
}
