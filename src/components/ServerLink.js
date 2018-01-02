import { View, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import * as actions from '../actions/filament';
import { STATES } from '../reducers/filament';
import Groups from './Groups';

export class ServerLink extends React.Component {
  static propTypes = {
    lookupState: PropTypes.oneOf(R.values(STATES)),
    updateServerUrl: PropTypes.func.isRequired,
    getServerUrl: PropTypes.func.isRequired,
    pingServer: PropTypes.func.isRequired,
    urlLooksValid: PropTypes.bool,
    serverUrl: PropTypes.string,
  };

  componentDidMount() {
    this.props.getServerUrl();
  }

  render() {
    const { lookupState, urlLooksValid } = this.props;

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
          title="Connect"
          disabled={!urlLooksValid}
          onPress={this.pingServer}
        />
      </View>
    );
  }

  pingServer = () => {
    const { serverUrl, urlLooksValid } = this.props;

    if (urlLooksValid) {
      this.props.pingServer(serverUrl);
    }
  };
}

export const mapStateToProps = state => ({
  urlLooksValid: R.path(['server', 'urlLooksValid'], state),
  lookupState: R.path(['server', 'state'], state),
  serverUrl: R.path(['server', 'url'], state),
});

const mapDispatchToProps = {
  updateServerUrl: actions.updateServerUrl,
  getServerUrl: actions.getServerUrl,
  pingServer: actions.pingServer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerLink);
