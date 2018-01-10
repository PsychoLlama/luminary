import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';
import {
  Text,
  View,
  Button,
  Keyboard,
  TextInput,
  StyleSheet,
} from 'react-native';

import * as actions from '../actions/filament';
import * as colors from '../constants/colors';
import { STATES } from '../reducers/filament';
import { selector } from '../utils/redux';

const styles = StyleSheet.create({
  container: {
    padding: '20%',
  },
  urlInput: {
    color: colors.text,
    marginBottom: 8,
    padding: 8,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'center',
  },
  header: {
    color: colors.text,
    textAlign: 'center',
    fontSize: 16,
  },
});

export class ServerLink extends React.Component {
  static propTypes = {
    lookupState: PropTypes.oneOf(R.values(STATES)),
    updateServerUrl: PropTypes.func.isRequired,
    pingServer: PropTypes.func.isRequired,
    testingConnection: PropTypes.bool,
    pingSuccessful: PropTypes.bool,
    urlLooksValid: PropTypes.bool,
    serverUrl: PropTypes.string,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigationOptions = {
    title: 'Connect to Filament',
  };

  render() {
    const { pingSuccessful, lookupState } = this.props;

    if (lookupState === STATES.LOADING) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>What&apos;s your Filament URL?</Text>

        <TextInput
          onChangeText={this.props.updateServerUrl}
          onSubmitEditing={this.pingServer}
          placeholder="http://..."
          style={styles.urlInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
        />

        <Button
          color={pingSuccessful === false ? colors.error : undefined}
          disabled={this.isDisabled()}
          title={this.getButtonText()}
          onPress={this.pingServer}
        />
      </View>
    );
  }

  isDisabled() {
    const { testingConnection, urlLooksValid } = this.props;

    return Boolean(testingConnection || !urlLooksValid);
  }

  getButtonText() {
    const { testingConnection, pingSuccessful } = this.props;

    if (testingConnection) {
      return 'Testing connection...';
    }

    if (pingSuccessful === false) {
      return 'Ping failed. Retry?';
    }

    return 'Connect';
  }

  pingServer = async () => {
    const { serverUrl } = this.props;

    if (!this.isDisabled()) {
      const { payload } = await this.props.pingServer(serverUrl);

      if (payload && payload.success) {
        Keyboard.dismiss();
        this.props.navigation.navigate('Groups');
      }
    }
  };
}

const withServerState = fn => R.pipe(R.prop('server'), fn);
export const mapStateToProps = selector({
  testingConnection: withServerState(R.prop('testingConnection')),
  pingSuccessful: withServerState(R.prop('pingSuccessful')),
  urlLooksValid: withServerState(R.prop('urlLooksValid')),
  lookupState: withServerState(R.prop('state')),
  serverUrl: withServerState(R.prop('url')),
});

const mapDispatchToProps = {
  updateServerUrl: actions.updateServerUrl,
  pingServer: actions.pingServer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerLink);
