import React from 'react';
import { View, StatusBar } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
      </View>
    );
  }
}
