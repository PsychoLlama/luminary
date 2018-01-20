import styled from 'styled-components/native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';
import { Button, Keyboard } from 'react-native';

import * as actions from '../actions/filament';
import * as colors from '../constants/colors';
import { selector } from '../utils/redux';

const Container = styled.View`
  padding: 20%;
`;

export const UrlInput = styled.TextInput`
  color: ${colors.text};
  margin-bottom: 8;
  padding: 8px 4px;
  text-align: center;
`;

const Header = styled.Text`
  color: ${colors.text};
  text-align: center;
  font-size: 16px;
`;

export class ServerLink extends React.Component {
  static propTypes = {
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
    const { pingSuccessful } = this.props;

    return (
      <Container>
        <Header>What&apos;s your Filament URL?</Header>

        <UrlInput
          onChangeText={this.props.updateServerUrl}
          onSubmitEditing={this.pingServer}
          placeholder="http://..."
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
      </Container>
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
  serverUrl: withServerState(R.prop('url')),
});

const mapDispatchToProps = {
  updateServerUrl: actions.updateServerUrl,
  pingServer: actions.pingServer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerLink);
