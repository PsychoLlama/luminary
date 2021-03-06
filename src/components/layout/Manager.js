import { PanResponder, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import * as actions from '../../actions/layout';
import { selector } from '../../utils/redux';
import Layout, { EMPTY } from './Layout';
import Selection from './Selection';
import Option from './Option';

const Container = styled.View`
  flex: 1;
`;

export class Manager extends React.Component {
  static propTypes = {
    reportInvalidSelection: PropTypes.func.isRequired,
    setDragActiveState: PropTypes.func.isRequired,
    createCellGroup: PropTypes.func.isRequired,
    setGroupHover: PropTypes.func.isRequired,
    editCellGroup: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
    selected: PropTypes.string,
  };

  static navigationOptions = {
    title: 'Change layout',
  };

  state = { dimensions: null };
  layouts = {};

  isEmptyLayout = ([, { type }]) => type === EMPTY;
  isReservedLayout = layout => !this.isEmptyLayout(layout);

  isValidSelection = (bounds, { top, left, right, bottom }) => {
    const ybounded =
      top >= bounds.top &&
      top < bounds.bottom &&
      bottom < bounds.bottom &&
      bottom >= bounds.top;

    const xbounded =
      left >= bounds.left &&
      left < bounds.right &&
      right < bounds.right &&
      right >= bounds.left;

    return xbounded && ybounded;
  };

  getBounds = layout => ({
    bottom: layout.y + layout.height,
    right: layout.x + layout.width,
    left: layout.x,
    top: layout.y,
  });

  onPanResponderRelease = () => {
    const { active, selected } = this.props;
    const hasSelection = !R.isEmpty(active);
    const allSelectionsValid = R.all(R.identity, R.values(active));

    if (selected) {
      this.props.editCellGroup(selected);
      this.props.navigation.navigate('LayoutConfig');
    } else if (hasSelection && allSelectionsValid) {
      this.props.createCellGroup(this.props.active);
      this.props.navigation.navigate('LayoutConfig');
    } else if (hasSelection) {
      this.props.reportInvalidSelection();
    }
  };

  onPanResponderMove = (event, { x0, y0, dx, dy }) => {
    const layout = this.state.dimensions;
    const { height } = Dimensions.get('window');
    const distanceFromTop = height - layout.height;

    const start = { x: x0, y: y0 - distanceFromTop };
    const end = { x: start.x + dx, y: start.y + dy };

    // Calculate selection box.
    const selection = {
      bottom: Math.max(start.y, end.y),
      right: Math.max(start.x, end.x),
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
    };

    const layouts = R.toPairs(this.layouts);
    const reserved = layouts.filter(this.isReservedLayout);
    if (!this.triggerReservedHover(reserved, start, selection)) {
      this.triggerSelectionHover(layouts, reserved, selection);
    }
  };

  // Simulate touchable press events.
  triggerReservedHover = (reserved, start, selection) => {
    const selecting = reserved.find(([, { layout }]) => {
      const bounds = this.getBounds(layout);

      const ybounded = start.y >= bounds.top && start.y < bounds.bottom;
      const xbounded = start.x >= bounds.left && start.x < bounds.right;

      return xbounded && ybounded;
    });

    if (selecting) {
      const [index, { layout }] = selecting;
      const bounds = this.getBounds(layout);
      const valid = this.isValidSelection(bounds, selection);
      const focus = valid ? index : null;

      if (this.props.selected !== focus) {
        this.props.setGroupHover(focus);
      }
    }

    return selecting;
  };

  // Perform drag selection detection.
  triggerSelectionHover = (layouts, reserved, { left, right, top, bottom }) => {
    // Locate cells which intersect with the selection area.
    const patches = layouts.reduce((patches, [index, { type, layout }]) => {
      const xbounded = layout.x + layout.width >= left && layout.x <= right;
      const ybounded = layout.y + layout.height > top && layout.y <= bottom;
      const bounded = xbounded && ybounded;

      if (bounded) {
        patches[index] = type === EMPTY;
      }

      return patches;
    }, {});

    if (!R.isEmpty(patches) && !R.equals(patches, this.props.active)) {
      this.props.setDragActiveState(patches);
    }
  };

  pan = PanResponder.create({
    onMoveShouldSetPanResponder: R.T,
    onPanResponderMove: this.onPanResponderMove,
    onPanResponderRelease: this.onPanResponderRelease,
  });

  render() {
    return (
      <Container {...this.pan.panHandlers} onLayout={this.setDimensions}>
        <Layout
          {...this.props}
          container={this.state.dimensions}
          renderReservedSpace={Selection}
          onCellLayout={this.addLayout}
          renderEmptySpace={Option}
        />
      </Container>
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

export const mapStateToProps = selector({
  selected: R.path(['layout', 'selectedGroup']),
  active: R.path(['layout', 'active']),
});

const mapDispatchToProps = {
  reportInvalidSelection: actions.reportInvalidSelection,
  setDragActiveState: actions.setDragActiveState,
  createCellGroup: actions.createCellGroup,
  editCellGroup: actions.editCellGroup,
  setGroupHover: actions.setGroupHover,
};

export default connect(mapStateToProps, mapDispatchToProps)(Manager);
