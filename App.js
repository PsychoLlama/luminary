import { View, StatusBar } from 'react-native';
import React from 'react';
import {
  createNetworkInterface,
  ApolloProvider,
  ApolloClient,
} from 'react-apollo';

import Groups from './src/components/Groups';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://hactar/',
  }),
});

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <View>
          <StatusBar hidden />
          <Groups />
        </View>
      </ApolloProvider>
    );
  }
}
