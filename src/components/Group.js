import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';

import * as colors from '../constants/colors';
import * as actions from '../actions/groups';
import { selector } from '../utils/redux';

export const styles = StyleSheet.create({
  container: {
    borderColor: colors.groups.divider,
    backgroundColor: colors.groups.bg,
    position: 'absolute',
    borderWidth: 1,
    borderBottomWidth: 2,
  },

  title: {
    color: colors.text,
    fontSize: 20,
    padding: 30,
    width: '100%',
    textAlign: 'center',
  },

  off: { borderBottomColor: colors.groups.status.off },
  on: { borderBottomColor: colors.groups.status.on },
});

const extractLayout = R.pick(['top', 'left', 'width', 'height']);
export class Group extends Component {
  static propTypes = {
    toggleLights: PropTypes.func.isRequired,
    serverUrl: PropTypes.string.isRequired,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      anyOn: PropTypes.bool,
    }).isRequired,
  };

  render() {
    const { group } = this.props;
    const online = group.anyOn ? styles.on : styles.off;
    const style = [styles.title];

    return (
      <TouchableWithoutFeedback onPress={this.toggleLights}>
        <View style={[styles.container, online, extractLayout(this.props)]}>
          <Text style={style}>{this.props.group.name}</Text>
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

export const mapStateToProps = selector({
  serverUrl: R.path(['server', 'url']),
  group: (state, props) => {
    const groupId = R.path(['layout', 'reserved', props.id, 'group'], state);

    return R.path(['groups', groupId], state);
  },
});

const mapDispatchToProps = {
  toggleLights: actions.toggleLights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
