import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

// eslint-disable-next-line import/named
import { KeepAwake } from 'expo';

import { DASHBOARD_MODE } from '../reducers/switches';
import * as actions from '../actions/groups';
import { selector } from '../utils/redux';

// For tablets, keep the screen on forever. Fetch periodically.
export class DashboardDetector extends React.Component {
  static propTypes = {
    fetchAllGroups: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    serverUrl: PropTypes.string,
  };

  mounted = false;
  timeout = null;

  componentDidMount() {
    this.mounted = true;
    this.scheduleNextRefetch();
  }

  componentDidUpdate(prev) {
    if (!prev.enabled && this.props.enabled) {
      this.scheduleNextRefetch();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.mounted = false;
  }

  scheduleNextRefetch = () => {
    // Possible to unmount while a request is in-flight.
    if (!this.mounted || !this.props.enabled) {
      return;
    }

    this.timeout = setTimeout(this.refetchGroups, 1000 * 10);
  };

  refetchGroups = () => {
    // Switch disabled since it last scheduled.
    if (!this.props.enabled) {
      return;
    }

    this.props
      .fetchAllGroups(this.props.serverUrl)
      .then(this.scheduleNextRefetch, this.scheduleNextRefetch);
  };

  render() {
    return this.props.enabled ? <KeepAwake /> : null;
  }
}

export const mapStateToProps = selector({
  enabled: R.path(['switches', DASHBOARD_MODE]),
  serverUrl: R.path(['server', 'url']),
});

const mapDispatchToProps = {
  fetchAllGroups: actions.fetchAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDetector);
