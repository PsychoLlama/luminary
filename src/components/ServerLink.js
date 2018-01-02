import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

export class ServerLink extends React.Component {
  static propTypes = {
    getServerUrl: PropTypes.func.isRequired,
  };

  state = { address: null, gotResponse: false };

  componentDidMount() {
    this.props.getServerUrl();
  }

  render() {
    return null;
  }
}

export const mapStateToProps = state => ({
  serverUrl: state.filamentServerUrl,
});

export default connect(mapStateToProps)(ServerLink);
