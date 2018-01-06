import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as colors from '../constants/colors';
import * as actions from '../actions/groups';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.groups.bg,
    width: '50%',
  },

  title: {
    color: colors.text,
    fontSize: 20,
    padding: 30,
    width: '100%',
    textAlign: 'center',
  },

  divide: {
    borderRightWidth: 2,
    borderColor: colors.groups.divider,
  },

  status: {
    height: 2,
    width: '100%',
  },

  off: { backgroundColor: colors.groups.status.off },
  on: { backgroundColor: colors.groups.status.on },
});

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
  serverUrl: R.path(['server', 'url'], state),
  group: R.path(['groups', props.id], state),
});

const mapDispatchToProps = {
  toggleLights: actions.toggleLights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
