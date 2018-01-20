import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import * as startupActions from '../actions/startup';

export class Loading extends React.Component {
  static propTypes = {
    getAppState: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
    }).isRequired,
  };

  async componentWillMount() {
    const { payload } = await this.props.getAppState();
    const route = payload.serverUrl ? 'Groups' : 'ServerLink';

    // Navigate without adding a back button.
    const navigate = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: route })],
    });

    this.props.navigation.dispatch(navigate);
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  getAppState: startupActions.getAppState,
};

export default connect(null, mapDispatchToProps)(Loading);
