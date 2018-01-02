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
    getServerUrl: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getServerUrl();
  }

  render() {
    const { lookupState } = this.props;

    if (lookupState === STATES.FOUND) {
      return <Groups />;
    }

    return null;
  }
}

export const mapStateToProps = state => ({
  lookupState: R.path(['server', 'state'], state),
  serverUrl: R.path(['server', 'url'], state),
});

const mapDispatchToProps = {
  getServerUrl: actions.getServerUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerLink);
