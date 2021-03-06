import { View, StatusBar, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import React from 'react';

// eslint-disable-next-line import/default
import Expo from 'expo';

import DashboardDetector from './src/components/DashboardDetector';
import AppSettings from './src/components/AppSettings';
import Manager from './src/components/layout/Manager';
import ServerLink from './src/components/ServerLink';
import Config from './src/components/layout/Config';
import * as colors from './src/constants/colors';
import Loading from './src/components/Loading';
import Groups from './src/components/Groups';
import store from './src/redux-store';

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
  },
});

const navigationOptions = {
  headerTitleStyle: { color: colors.navbar.text },
  headerTintColor: colors.navbar.text,
  headerStyle: {
    marginTop: -Expo.Constants.statusBarHeight,
    backgroundColor: colors.navbar.bg,
  },
};

const Routes = StackNavigator(
  {
    LayoutManager: {
      navigationOptions,
      screen: Manager,
    },
    AppSettings: { screen: AppSettings, navigationOptions },
    ServerLink: { screen: ServerLink, navigationOptions },
    LayoutConfig: { screen: Config, navigationOptions },
    Loading: { screen: Loading, navigationOptions },
    Groups: { screen: Groups, navigationOptions },
  },
  {
    initialRouteName: 'Loading',
    cardStyle: {
      backgroundColor: colors.appBackground,
    },
  },
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <DashboardDetector />
          <StatusBar hidden />
          <Routes />
        </View>
      </Provider>
    );
  }
}
