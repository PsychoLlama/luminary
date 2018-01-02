import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import {
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';

import * as actions from '../actions/groups';
import styles from './Group.style';

export class Group extends Component {
  static propTypes = {
    toggleLights: PropTypes.func.isRequired,
    serverUrl: PropTypes.string.isRequired,
    divide: PropTypes.bool,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      anyOn: PropTypes.bool,
    }).isRequired,
  }

  render() {
    const { group, divide } = this.props;
    const online = group.anyOn ? styles.on : styles.off;
    const style = [styles.title];

    if (divide) {
      style.push(styles.divide);
    }

    return (
      <TouchableWithoutFeedback onPress={this.toggleLights}>
        <View style={styles.container}>
          <Text style={style}>
            {this.props.group.name}
          </Text>

          <View style={[styles.status, online]} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  toggleLights = () => {
    const { serverUrl, group } = this.props;

    this.props.toggleLights(serverUrl, {
      on: !group.anyOn,
      id: group.id,
    });
  };
}

export const mapStateToProps = (state, props) => ({
  group: R.path(['groups', props.id], state),
  serverUrl: state.filamentServerUrl,
});

const mapDispatchToProps = {
  toggleLights: actions.toggleLights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
