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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderBottomWidth: 2,
    borderWidth: 1,
  },

  title: {
    color: colors.text,
    fontSize: 20,
    padding: 2,
  },

  smallTitle: {
    fontSize: 12,
  },

  off: { borderBottomColor: colors.groups.status.off },
  on: { borderBottomColor: colors.groups.status.on },
});

const extractLayout = R.pick(['top', 'left', 'width', 'height']);
export class Group extends Component {
  static propTypes = {
    toggleLights: PropTypes.func.isRequired,
    blockWidth: PropTypes.number.isRequired,
    serverUrl: PropTypes.string.isRequired,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      anyOn: PropTypes.bool,
    }).isRequired,
  };

  render() {
    const { group, blockWidth } = this.props;
    const online = group.anyOn ? styles.on : styles.off;
    const style = [styles.title, blockWidth === 1 && styles.smallTitle];

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

const withLayout = fn => (state, props) =>
  R.pipe(R.path(['layout', 'reserved', props.id]), fn)(state);

export const mapStateToProps = selector({
  blockWidth: withLayout(R.prop('width')),
  serverUrl: R.path(['server', 'url']),
  group: (state, props) => {
    const groupId = withLayout(R.prop('group'))(state, props);

    return R.path(['groups', groupId], state);
  },
});

const mapDispatchToProps = {
  toggleLights: actions.toggleLights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
