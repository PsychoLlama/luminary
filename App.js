import { View, StatusBar } from 'react-native';
import React from 'react';

import Groups from './src/components/Groups';
import styles from './App.style';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Groups />
      </View>
    );
  }
}
