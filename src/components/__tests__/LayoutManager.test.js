import { Dimensions } from 'react-native';
import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import { LayoutManager, mapStateToProps } from '../LayoutManager';
import LayoutSelection from '../LayoutSelection';
import Layout, { fmtIndex, EMPTY, RESERVED } from '../Layout';
import LayoutOption from '../LayoutOption';

jest.spyOn(Dimensions, 'get');

describe('LayoutManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = merge => {
    const props = {
      setDragActiveState: jest.fn(),
      createCellGroup: jest.fn(),
      setGroupHover: jest.fn(),
      editCellGroup: jest.fn(),
      selected: null,
      active: {},
      navigation: {
        navigate: jest.fn(),
      },
      ...merge,
    };

    const output = shallow(<LayoutManager {...props} />);
    const dimensions = { top: 0, left: 0, height: 630, width: 360 };
    const event = { nativeEvent: { layout: dimensions } };
    output.simulate('layout', event);

    // Hack: perfectly divisible. Avoids leftover height calculations.
    Dimensions.get.mockReturnValue(dimensions);

    return {
      dimensions,
      output,
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('renders a layout', () => {
    const { output, props } = setup();
    const layout = output.find(Layout);

    expect(layout.exists()).toBe(true);
    expect(layout.prop('navigation')).toBe(props.navigation);
  });

  it('passes container dimensions to the layout', () => {
    const { output, dimensions } = setup();
    const layout = output.find(Layout);

    expect(layout.prop('container')).toBe(dimensions);
  });

  it('shows options in empty spaces', () => {
    const { output } = setup();
    const layout = output.find(Layout);

    expect(layout.prop('renderEmptySpace')).toBe(LayoutOption);
  });

  it('shows group slots in reserved spaces', () => {
    const { output } = setup();
    const layout = output.find(Layout);

    expect(layout.prop('renderReservedSpace')).toBe(LayoutSelection);
  });

  describe('gesture', () => {
    const gesture = merge => {
      const result = setup(merge);

      const { onCellLayout } = result.output.find(Layout).props();
      const indexLayouts = R.map(R.apply(onCellLayout));
      const height = 97.33;
      const width = 90;

      // Real layout data.
      R.pipe(R.toPairs, indexLayouts)({
        '1:1': { type: EMPTY, layout: { height, width, y: 0, x: 0 } },
        '1:2': { type: EMPTY, layout: { height, width, y: 0, x: 90 } },
        '1:3': { type: EMPTY, layout: { height, width, y: 0, x: 180 } },
        '1:4': { type: EMPTY, layout: { height, width, y: 0, x: 270 } },
        '2:1': { type: EMPTY, layout: { height, width, y: 97.33, x: 0 } },
        '2:2': { type: EMPTY, layout: { height, width, y: 97.33, x: 90 } },
        '2:3': { type: EMPTY, layout: { height, width, y: 97.33, x: 180 } },
        '2:4': { type: EMPTY, layout: { height, width, y: 97.33, x: 270 } },
        '3:1': { type: EMPTY, layout: { height, width, y: 194.67, x: 0 } },
        '3:2': { type: EMPTY, layout: { height, width, y: 194.67, x: 90 } },
        '3:3': { type: EMPTY, layout: { height, width, y: 194.67, x: 180 } },
        '3:4': { type: EMPTY, layout: { height, width, y: 194.67, x: 270 } },
        '4:1': { type: EMPTY, layout: { height, width, y: 292, x: 0 } },
        '4:2': { type: EMPTY, layout: { height, width, y: 292, x: 90 } },
        '4:3': { type: EMPTY, layout: { height, width, y: 292, x: 180 } },
        '4:4': { type: EMPTY, layout: { height, width, y: 292, x: 270 } },
        '5:1': { type: EMPTY, layout: { height, width, y: 389.33, x: 0 } },
        '5:2': { type: EMPTY, layout: { height, width, y: 389.33, x: 90 } },
        '5:3': { type: EMPTY, layout: { height, width, y: 389.33, x: 180 } },
        '5:4': { type: EMPTY, layout: { height, width, y: 389.33, x: 270 } },
        '6:1': { type: RESERVED, layout: { height, width, y: 486.67, x: 0 } },
        '6:2': { type: RESERVED, layout: { height, width, y: 486.67, x: 90 } },
        '6:3': { type: RESERVED, layout: { height, width, y: 486.67, x: 180 } },
        '6:4': { type: RESERVED, layout: { height, width, y: 486.67, x: 270 } },
      });

      const {
        onPanResponderMove,
        onPanResponderRelease,
      } = result.output.instance();

      return {
        ...result,
        onMove: onPanResponderMove,
        onRelease: onPanResponderRelease,
      };
    };

    it('marks cells as active when dragging immediately over them', () => {
      const { props, onMove } = gesture();

      const event = { x0: 1, y0: 1, dx: 4, dy: 4 };
      onMove(null, event);

      const index = fmtIndex(1, 1);
      const payload = { [index]: true };
      expect(props.setDragActiveState).toHaveBeenCalledWith(payload);
    });

    it('marks cells as selected if intersection exists', () => {
      const { props, dimensions, onMove } = gesture();

      // The whole top row.
      const event = {
        y0: 1,
        dy: 1,
        x0: dimensions.width - 1,
        dx: -dimensions.width + 1,
      };

      onMove(null, event);

      expect(props.setDragActiveState).toHaveBeenCalledWith({
        [fmtIndex(1, 1)]: true,
        [fmtIndex(1, 2)]: true,
        [fmtIndex(1, 3)]: true,
        [fmtIndex(1, 4)]: true,
      });
    });

    it('shows a setup page after selecting cells', () => {
      const { props, onRelease } = gesture({
        active: { '1:1': true },
      });

      onRelease();
      expect(props.createCellGroup).toHaveBeenCalledWith(props.active);
      expect(props.navigation.navigate).toHaveBeenCalledWith('LayoutConfig');
    });

    it('does not trigger a config if nothing is selected', () => {
      const { props, onRelease } = gesture({
        active: {},
      });

      onRelease();

      expect(props.createCellGroup).not.toHaveBeenCalled();
      expect(props.navigation.navigate).not.toHaveBeenCalled();
    });

    it('selects existing cell groups on move', () => {
      const { props, onMove } = gesture();
      const event = { x0: 1, y0: 490, dx: 0, dy: 0 };
      onMove(null, event);

      expect(props.setGroupHover).toHaveBeenCalledWith('6:1');
    });

    it('unselects the group if drug out of bounds', () => {
      const { props, onMove } = gesture({
        selected: '6:1',
      });

      const event = { x0: 1, y0: 490, dx: 0, dy: -150 };
      onMove(null, event);

      expect(props.setGroupHover).toHaveBeenCalledWith(null);
      expect(props.setDragActiveState).not.toHaveBeenCalled();
    });

    it('edits the cell group on press', () => {
      const { props, onRelease } = gesture({
        selected: '1:1',
      });

      onRelease();

      expect(props.editCellGroup).toHaveBeenCalledWith(props.selected);
    });

    it('does not edit cell groups if unselected', () => {
      const { props, onRelease } = gesture({
        selected: null,
      });

      onRelease();

      expect(props.editCellGroup).not.toHaveBeenCalled();
    });
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        layout: {
          selectedGroup: '1:3',
          active: {
            '1:1': true,
            '2:1': true,
            '3:1': true,
          },
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state),
        state,
      };
    };

    it('gets the set of active cells', () => {
      const { props, state } = select();

      expect(props.active).toEqual(state.layout.active);
    });

    it('indicates what group is selected', () => {
      const { props, state } = select();

      expect(props.selected).toBe(state.layout.selectedGroup);
    });
  });
});
