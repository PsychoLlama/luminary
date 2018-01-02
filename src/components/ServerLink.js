import { TextInput } from 'react-native';
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
  };

  componentDidMount() {
    this.props.getServerUrl();
  }

  render() {
    const { lookupState } = this.props;

    if (lookupState === STATES.LOADING) {
      return null;
    }

    if (lookupState === STATES.FOUND) {
      return <Groups />;
    }

    return (
      <TextInput onChangeText={this.props.updateServerUrl} />
    );
  }
}

export const mapStateToProps = state => ({
  lookupState: R.path(['server', 'state'], state),
  serverUrl: R.path(['server', 'url'], state),
});

const mapDispatchToProps = {
  updateServerUrl: actions.updateServerUrl,
  getServerUrl: actions.getServerUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerLink);
