import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

// eslint-disable-next-line import/named
import { KeepAwake } from 'expo';

import { DASHBOARD_MODE } from '../reducers/switches';
import { selector } from '../utils/redux';

// For tablets, keep the screen on for eternity.
export class DashboardDetector extends React.Component {
  static propTypes = {
    enabled: PropTypes.bool.isRequired,
  };

  render() {
    return this.props.enabled ? <KeepAwake /> : null;
  }
}

export const mapStateToProps = selector({
  enabled: R.path(['switches', DASHBOARD_MODE]),
});

export default connect(mapStateToProps)(DashboardDetector);
