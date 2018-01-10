import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import LayoutSelection from './LayoutSelection';
import * as actions from '../actions/layout';
import LayoutOption from './LayoutOption';
import Layout from './Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class LayoutManager extends React.Component {
  static propTypes = {
    setDragActiveState: PropTypes.func.isRequired,
    createCellGroup: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Change layout',
  };

  state = { dimensions: null };
  layouts = {};

  onPanResponderRelease = () => {
    const { active } = this.props;
    if (!R.isEmpty(active)) {
      this.props.createCellGroup(this.props.active);
      this.props.navigation.navigate('LayoutConfig');
    }
  };

  onPanResponderMove = (event, { x0, y0, dx, dy }) => {
    const layout = this.state.dimensions;
    const { height } = Dimensions.get('window');
    y0 -= height - layout.height;

    dx = x0 + dx;
    dy = y0 + dy;

    const left = Math.min(x0, dx);
    const right = Math.max(x0, dx);
    const top = Math.min(y0, dy);
    const bottom = Math.max(y0, dy);

    // Locate which cells intersect with the selection area.
    const patches = R.toPairs(this.layouts).reduce(
      (patches, [index, layout]) => {
        const active = this.props.active.hasOwnProperty(index);

        const xbounded = layout.x + layout.width >= left && layout.x <= right;
        const ybounded = layout.y + layout.height > top && layout.y <= bottom;
        const bounded = xbounded && ybounded;

        if (bounded && !active) {
          patches[index] = true;
        } else if (!bounded && active) {
          patches[index] = false;
        }

        return patches;
      },
      {},
    );

    if (!R.isEmpty(patches)) {
      this.props.setDragActiveState(patches);
    }
  };

  pan = PanResponder.create({
    onStartShouldSetPanResponder: R.T,
    onStartShouldSetPanResponderCapture: R.T,
    onMoveShouldSetPanResponder: R.T,
    onMoveShouldSetPanResponderCapture: R.T,

    onPanResponderMove: this.onPanResponderMove,
    onPanResponderRelease: this.onPanResponderRelease,
  });

  render() {
    return (
      <View
        {...this.pan.panHandlers}
        onLayout={this.setDimensions}
        style={styles.container}
      >
        <Layout
          {...this.props}
          renderReservedSpace={LayoutSelection}
          container={this.state.dimensions}
          renderEmptySpace={LayoutOption}
          onCellLayout={this.addLayout}
        />
      </View>
    );
  }

  setDimensions = event => {
    const { layout } = event.nativeEvent;
    this.setState({ dimensions: layout });
  };

  addLayout = (id, layout) => {
    this.layouts[id] = layout;
  };
}

export const mapStateToProps = state => ({
  active: R.path(['layout', 'active'], state),
});

const mapDispatchToProps = {
  setDragActiveState: actions.setDragActiveState,
  createCellGroup: actions.createCellGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutManager);
