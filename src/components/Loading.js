import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import * as actions from '../actions/filament';

export class Loading extends React.Component {
  static propTypes = {
    getServerUrl: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
    }).isRequired,
  };

  async componentWillMount() {
    const { payload: url } = await this.props.getServerUrl();
    const route = url ? 'Groups' : 'ServerLink';

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
  getServerUrl: actions.getServerUrl,
};

export default connect(null, mapDispatchToProps)(Loading);
