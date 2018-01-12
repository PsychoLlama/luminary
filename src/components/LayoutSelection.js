import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import * as colors from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.groups.bg,
    borderWidth: 0.5,
    borderColor: colors.groups.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: colors.text,
  },
  smallTitle: {
    fontSize: 12,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export class LayoutSelection extends React.Component {
  static propTypes = {
    blockWidth: PropTypes.number.isRequired,
    groupTitle: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    onLayout: PropTypes.func,
  };

  pan = PanResponder.create({
    onStartShouldSetPanResponder: R.T,
    onMoveShouldSetPanResponder: R.T,
    onPanResponderTerminationRequest: R.F,
    onPanResponderMove: this.onPanResponderMove,
  });

  onPanResponderMove = R.always(undefined);

  render() {
    const inline = R.pick(['height', 'width', 'left', 'top'], this.props);
    const { groupTitle, blockWidth } = this.props;
    const titleSize = blockWidth === 1 && styles.smallTitle;

    return (
      <View
        {...this.pan.panHandlers}
        style={[styles.container, inline]}
        onLayout={this.props.onLayout}
      >
        <TouchableOpacity style={styles.touchable}>
          <Text style={[styles.title, titleSize]}>{groupTitle}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export const mapStateToProps = (state, props) => {
  const layout = R.path(['layout', 'reserved', props.id], state);
  const groupId = R.prop('group', layout);

  return {
    groupTitle: R.path(['groups', groupId, 'name'], state),
    blockWidth: R.prop('width', layout),
  };
};

export default connect(mapStateToProps)(LayoutSelection);
