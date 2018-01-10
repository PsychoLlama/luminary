import { Dimensions } from 'react-native';
import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import LayoutSelection from '../LayoutSelection';
import LayoutOption from '../LayoutOption';
import { Layout, fmtIndex, mapStateToProps, OPTIONS_PER_ROW } from '../Layout';

jest.spyOn(Dimensions, 'get');

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = merge => {
    const dimensions = { height: 630, width: 360 };
    const props = {
      setDragActiveState: jest.fn(),
      createCellGroup: jest.fn(),
      container: dimensions,
      reserved: [],
      active: {},
      navigation: {
        navigate: jest.fn(),
      },
      ...merge,
    };

    // Hack: perfectly divisible. Avoids leftover height calculations.
    Dimensions.get.mockReturnValue(dimensions);

    const output = shallow(<Layout {...props} />);
    return {
      dimensions,
      output,
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('shows no options if layout is unset', () => {
    const { output } = setup({ container: null });
    const options = output.find(LayoutOption);

    expect(options.length).toBe(0);
  });

  it('shows a screen of options', () => {
    const { output, dimensions } = setup();
    const options = output.find(LayoutOption);

    const rows = dimensions.height / (dimensions.width / OPTIONS_PER_ROW);
    const expected = Math.floor(rows * OPTIONS_PER_ROW);

    expect(options.length).toBe(expected);
  });

  it('sets the proper size', () => {
    const { output, dimensions } = setup();
    const option = output.find(LayoutOption).first();

    expect(option.prop('width')).toBe(dimensions.width / OPTIONS_PER_ROW);
    expect(option.prop('height')).toBe(dimensions.width / OPTIONS_PER_ROW);
  });

  it('sets the proper position', () => {
    const { output, dimensions } = setup();

    const width = dimensions.width / OPTIONS_PER_ROW;
    // 4th from the top.
    const top = width * 3;
    // 3rd from the left.
    const left = width * 2;

    const option = output.find(LayoutOption).at(14);

    expect(option.prop('top')).toBe(top);
    expect(option.prop('left')).toBe(left);
  });

  it('indicates whether cells are drag active', () => {
    const { output } = setup({
      active: { '1:2': true },
    });

    const first = output.find(LayoutOption).at(0);
    const second = output.find(LayoutOption).at(1);

    expect(first.prop('active')).toBe(false);
    expect(second.prop('active')).toBe(true);
  });

  it('shows reserved spaces', () => {
    const { output } = setup({
      reserved: [
        {
          group: '1',
          height: 2,
          width: 2,
          x: 0,
          y: 0,
        },
      ],
    });

    const selection = output.find(LayoutSelection);
    const options = output.find(LayoutOption);

    expect(selection.length).toBe(1);

    // 28 minus 4 from the reserved slot.
    expect(options.length).toBe(24);
  });

  it('calculates the correct reservation position', () => {
    const reserved = {
      group: '1',
      height: 4,
      width: 3,
      x: 2,
      y: 1,
    };

    const { output, dimensions } = setup({
      reserved: [reserved],
    });

    const size = dimensions.width / OPTIONS_PER_ROW;
    const selection = output.find(LayoutSelection);

    expect(selection.props()).toMatchObject({
      height: reserved.height * size,
      width: reserved.width * size,
      left: reserved.x * size,
      top: reserved.y * size,
    });
  });

  describe('gesture', () => {
    const gesture = merge => {
      const result = setup(merge);

      const invokeLayout = element => {
        const layout = {
          height: element.prop('height'),
          width: element.prop('width'),
          x: element.prop('left'),
          y: element.prop('top'),
        };

        const event = { nativeEvent: { layout } };
        element.simulate('layout', event);
      };

      result.output.find(LayoutOption).forEach(invokeLayout);
      result.output.find(LayoutSelection).forEach(invokeLayout);

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

    it('does not mark cells as active while already active', () => {
      const { props, onMove } = gesture({
        active: { [fmtIndex(1, 1)]: true },
      });

      const event = { x0: 1, y0: 1, dx: 1, dy: 1 };
      onMove(null, event);

      expect(props.setDragActiveState).not.toHaveBeenCalled();
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

    it('marks cells inactive when drawn away', () => {
      const { props, onMove } = gesture({
        active: { '4:1': true },
      });

      const event = { y0: 1, dy: 1, x0: 1, dx: 1 };
      onMove(null, event);

      expect(props.setDragActiveState).toHaveBeenCalledWith({
        [fmtIndex(4, 1)]: false,
        [fmtIndex(1, 1)]: true,
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
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        layout: {
          active: {
            '1:1': true,
            '2:1': true,
            '3:1': true,
          },
          reserved: {
            '0:1': {
              group: '12',
              height: 2,
              width: 2,
              x: 0,
              y: 1,
            },
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

    it('retrieves every reserved slot', () => {
      const { props, state } = select();

      const expected = R.values(state.layout.reserved);
      expect(props.reserved).toEqual(expected);
    });

    it('keeps the same reservation list between selects', () => {
      const reserved = { '1:1': { x: 1, y: 1 } };
      const updates = {
        layout: {
          reserved: { $set: reserved },
        },
      };

      const { props } = select(updates);
      expect(props.reserved).toBe(select(updates).props.reserved);
    });
  });
});
