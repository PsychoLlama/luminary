import { View, Dimensions, PanResponder } from 'react-native';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import LayoutSelection from './LayoutSelection';
import * as actions from '../actions/layout';
import LayoutOption from './LayoutOption';

export const OPTIONS_PER_ROW = 4;
export const fmtIndex = (x, y) => `${x}:${y}`;
const extractDimensions = R.pick(['top', 'left', 'width', 'height']);

export class LayoutManager extends React.Component {
  static propTypes = {
    setDragActiveState: PropTypes.func.isRequired,
    createCellGroup: PropTypes.func.isRequired,
    active: PropTypes.object.isRequired,
    reserved: PropTypes.arrayOf(
      PropTypes.shape({
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
    ),
  };

  layouts = {};
  onPanResponderRelease = () => {
    this.props.createCellGroup(this.props.active);
  };

  onPanResponderMove = (event, { x0, y0, dx, dy }) => {
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

    if (R.keys(patches).length) {
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
    const dimensions = this.getDimensions();

    const options = this.findOpenCells(dimensions).map(this.renderOption, this);
    const reservations = this.findReservedCells(dimensions).map(
      this.renderReservation,
      this,
    );

    const cells = options.concat(reservations);

    return <View {...this.pan.panHandlers}>{cells}</View>;
  }

  /**
   * Find layouts not occupied by reserved cells.
   * @param  {Object} dimensions - Data from this.getDimensions()
   * @return {Object[]} - A list of available cell locations.
   */
  findOpenCells({ rows, ...dimensions }) {
    const { reserved } = this.props;
    const totalOptions = rows * OPTIONS_PER_ROW;
    const reservationIndex = reserved.reduce((map, reserved) => {
      const { x, y, width, height } = reserved;

      // Index every X/Y coordinate occupied by the reservation.
      for (let xi = x; xi < x + width; xi += 1) {
        for (let yi = y; yi < y + height; yi += 1) {
          map[fmtIndex(xi, yi)] = reserved;
        }
      }

      return map;
    }, {});

    return Array(totalOptions)
      .fill()
      .reduce((cells, value, id) => {
        const layout = this.getOptionLayout(dimensions, id);
        const index = fmtIndex(layout.col - 1, layout.row - 1);

        // Don't render a cell on this X/Y coordinate if it's occupied.
        if (reservationIndex.hasOwnProperty(index)) return cells;

        return cells.concat(layout);
      }, []);
  }

  /**
   * Turn every reserved cell group into exact coordinates.
   * @param  {Object} dimensions - From this.getDimensions()
   * @return {Object[]} - Reservation cell layouts.
   */
  findReservedCells({ width, height }) {
    const { reserved } = this.props;

    return reserved.map(reservation => ({
      reservation,
      layout: {
        height: reservation.height * height,
        width: reservation.width * width,
        left: reservation.x * width,
        top: reservation.y * height,
      },
    }));
  }

  /**
   * Calculates the ideal height/width of every cell
   * to maximize screen usage.
   * @return {Object} - height/width values and the number of
   * expected rows.
   */
  getDimensions() {
    const { width, height } = Dimensions.get('window');

    const size = width / OPTIONS_PER_ROW;

    const rows = Math.floor(height / size);
    const leftOver = height - rows * size;

    return {
      height: size + leftOver / rows,
      width: size,
      rows,
    };
  }

  // This would be so much easier with CSS grid.
  getOptionLayout({ height, width }, id) {
    // Compensate for 0-based indexing.
    id += 1;

    const row = Math.ceil(id / 4);
    const col = id - (row - 1) * 4;

    return {
      left: (col - 1) * width,
      top: (row - 1) * height,
      height,
      width,
      row,
      col,
    };
  }

  renderOption(layout) {
    const values = extractDimensions(layout);
    const index = fmtIndex(layout.col, layout.row);
    const setLayout = event => (this.layouts[index] = event.nativeEvent.layout);
    const active = this.props.active.hasOwnProperty(index);

    return (
      <LayoutOption
        onLayout={setLayout}
        active={active}
        key={index}
        id={index}
        {...values}
      />
    );
  }

  renderReservation({ reservation, layout }) {
    const values = extractDimensions(layout);
    const index = fmtIndex(reservation.x, reservation.y);
    const setLayout = event => (this.layouts[index] = event.nativeEvent.layout);

    return (
      <LayoutSelection
        onLayout={setLayout}
        key={index}
        id={index}
        {...values}
      />
    );
  }
}

const getReservationList = createSelector(R.identity, R.values);
export const mapStateToProps = state => ({
  reserved: getReservationList(R.path(['layout', 'reserved'], state)),
  active: R.path(['layout', 'active'], state),
});

const mapDispatchToProps = {
  setDragActiveState: actions.setDragActiveState,
  createCellGroup: actions.createCellGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutManager);
