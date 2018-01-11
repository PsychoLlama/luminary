import { View, StyleSheet } from 'react-native';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import * as actions from '../actions/layout';
import { selector } from '../utils/redux';

export const OPTIONS_PER_ROW = 4;
export const fmtIndex = (x, y) => `${x}:${y}`;
const extractDimensions = R.pick(['top', 'left', 'width', 'height']);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export class Layout extends React.Component {
  static propTypes = {
    renderReservedSpace: PropTypes.func.isRequired,
    setDragActiveState: PropTypes.func.isRequired,
    renderEmptySpace: PropTypes.func.isRequired,
    createCellGroup: PropTypes.func.isRequired,
    active: PropTypes.object.isRequired,
    onCellLayout: PropTypes.func,
    container: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
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
    onCellLayout: R.always(undefined),
  };

  render() {
    const dimensions = this.getDimensions();
    const props = {
      style: styles.container,
    };

    if (dimensions) {
      const options = this.findOpenCells(dimensions).map(
        this.renderOption,
        this,
      );

      const reservations = this.findReservedCells(dimensions).map(
        this.renderReservation,
        this,
      );

      props.children = options.concat(reservations);
    }

    return <View {...props} />;
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
    if (!this.props.container) {
      return null;
    }

    const { width, height } = this.props.container;
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

  extractLayout = R.path(['nativeEvent', 'layout']);
  renderOption(layout) {
    const EmptySpace = this.props.renderEmptySpace;
    const values = extractDimensions(layout);
    const index = fmtIndex(layout.col - 1, layout.row - 1);
    const active = this.props.active.hasOwnProperty(index);
    const setLayout = event =>
      this.props.onCellLayout(index, this.extractLayout(event));

    return (
      <EmptySpace
        onLayout={setLayout}
        active={active}
        key={index}
        id={index}
        {...values}
      />
    );
  }

  renderReservation({ reservation, layout }) {
    const Reservation = this.props.renderReservedSpace;
    const values = extractDimensions(layout);
    const index = fmtIndex(reservation.x, reservation.y);
    const setLayout = event =>
      this.props.onCellLayout(index, this.extractLayout(event));

    return (
      <Reservation onLayout={setLayout} key={index} id={index} {...values} />
    );
  }
}

export const mapStateToProps = selector({
  reserved: createSelector(R.path(['layout', 'reserved']), R.values),
  active: R.path(['layout', 'active']),
});

const mapDispatchToProps = {
  setDragActiveState: actions.setDragActiveState,
  createCellGroup: actions.createCellGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
