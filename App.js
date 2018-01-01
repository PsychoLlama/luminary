import { View, StatusBar } from 'react-native';
import React from 'react';
import {
  createNetworkInterface,
  ApolloProvider,
  ApolloClient,
} from 'react-apollo';

import Groups from './src/components/Groups';
import styles from './App.style';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://192.168.0.27/',
  }),
});

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <StatusBar hidden />
          <Groups />
        </View>
      </ApolloProvider>
    );
  }
}
