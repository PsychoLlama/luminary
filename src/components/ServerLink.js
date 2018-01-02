import { View, TextInput, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import * as actions from '../actions/filament';
import { STATES } from '../reducers/filament';
import { error } from '../constants/colors';
import Groups from './Groups';

export class ServerLink extends React.Component {
  static propTypes = {
    lookupState: PropTypes.oneOf(R.values(STATES)),
    updateServerUrl: PropTypes.func.isRequired,
    getServerUrl: PropTypes.func.isRequired,
    pingServer: PropTypes.func.isRequired,
    testingConnection: PropTypes.bool,
    pingSuccessful: PropTypes.bool,
    urlLooksValid: PropTypes.bool,
    serverUrl: PropTypes.string,
  };

  componentDidMount() {
    this.props.getServerUrl();
  }

  render() {
    const {
      pingSuccessful,
      lookupState,
    } = this.props;

    if (lookupState === STATES.LOADING) {
      return null;
    }

    if (lookupState === STATES.FOUND) {
      return <Groups />;
    }

    return (
      <View>
        <TextInput
          onChangeText={this.props.updateServerUrl}
          onSubmitEditing={this.pingServer}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
        />

        <Button
          color={pingSuccessful === false ? error : undefined}
          disabled={this.isDisabled()}
          title={this.getButtonText()}
          onPress={this.pingServer}
        />
      </View>
    );
  }

  isDisabled() {
    const { testingConnection, urlLooksValid } = this.props;

    return Boolean(
      testingConnection ||
      !urlLooksValid
    );
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

  pingServer = () => {
    const { serverUrl } = this.props;

    if (!this.isDisabled()) {
      this.props.pingServer(serverUrl);
    }
  };
}

export const mapStateToProps = state => {
  const server = R.path(['server'], state);

  return {
    testingConnection: R.path(['testingConnection'], server),
    pingSuccessful: R.path(['pingSuccessful'], server),
    urlLooksValid: R.path(['urlLooksValid'], server),
    lookupState: R.path(['state'], server),
    serverUrl: R.path(['url'], server),
  };
};

const mapDispatchToProps = {
  updateServerUrl: actions.updateServerUrl,
  getServerUrl: actions.getServerUrl,
  pingServer: actions.pingServer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerLink);
