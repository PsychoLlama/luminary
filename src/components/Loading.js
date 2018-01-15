import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import * as filamentActions from '../actions/filament';
import * as layoutActions from '../actions/layout';

export class Loading extends React.Component {
  static propTypes = {
    getServerUrl: PropTypes.func.isRequired,
    getLayouts: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
    }).isRequired,
  };

  async componentWillMount() {
    this.props.getLayouts();

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
  getServerUrl: filamentActions.getServerUrl,
  getLayouts: layoutActions.getLayouts,
};

export default connect(null, mapDispatchToProps)(Loading);
