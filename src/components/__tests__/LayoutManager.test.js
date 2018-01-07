import { Dimensions } from 'react-native';
import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import LayoutSelection from '../LayoutSelection';
import LayoutOption from '../LayoutOption';
import {
  fmtIndex,
  LayoutManager,
  mapStateToProps,
  OPTIONS_PER_ROW,
} from '../LayoutManager';

jest.spyOn(Dimensions, 'get');

describe('LayoutManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = merge => {
    const props = {
      setDragActiveState: jest.fn(),
      reserved: [],
      active: {},
      ...merge,
    };

    // Hack: perfectly divisible. Avoids leftover height calculations.
    const dimensions = { height: 630, width: 360 };
    Dimensions.get.mockReturnValue(dimensions);

    return {
      output: shallow(<LayoutManager {...props} />),
      dimensions,
      props,
    };
  };

  it('renders', () => {
    setup();
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
      active: { '2:1': true },
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
          left: element.prop('left'),
          top: element.prop('top'),
        };

        element.simulate('layout', layout);
      };

      result.output.find(LayoutOption).forEach(invokeLayout);
      result.output.find(LayoutSelection).forEach(invokeLayout);

      return result;
    };

    it('marks cells as active when dragging immediately over them', () => {
      const { output, props } = gesture();

      const state = { x0: 1, y0: 1, dx: 4, dy: 4 };
      output.instance().onPanResponderMove(null, state);

      const index = fmtIndex(0, 0);
      const payload = { active: true, index };
      expect(props.setDragActiveState).toHaveBeenCalledWith(payload);
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
  });
});
