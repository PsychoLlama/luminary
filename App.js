import { View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import React from 'react';

import ServerLink from './src/components/ServerLink';
import store from './src/redux-store';
import styles from './App.style';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar hidden />
          <ServerLink />
        </View>
      </Provider>
    );
  }
}
