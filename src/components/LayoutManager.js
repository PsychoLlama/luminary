import { View, Dimensions, PanResponder } from 'react-native';
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

  static defaultProps = {
    reserved: [],
  };

  layouts = {};
  pan = PanResponder.create({
    onStartShouldSetPanResponder: R.T,
    onStartShouldSetPanResponderCapture: R.T,
    onMoveShouldSetPanResponder: R.T,
    onMoveShouldSetPanResponderCapture: R.T,

    onPanResponderMove: this.onPanResponderMove,
    onPanResponderTerminate: this.onPanResponderTerminate,
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

  // Placeholders.
  onPanResponderTerminate = R.always(null);
  onPanResponderMove = () => {
    this.props.setDragActiveState({ index: '0:0', active: true });
  };

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
    const setLayout = layout => (this.layouts[index] = layout);
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
    const setLayout = layout => (this.layouts[index] = layout);

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

export const mapStateToProps = state => ({
  active: R.path(['layout', 'active'], state),
});

const mapDispatchToProps = {
  setDragActiveState: actions.setDragActiveState,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutManager);
