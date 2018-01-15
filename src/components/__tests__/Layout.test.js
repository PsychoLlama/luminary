import { Dimensions } from 'react-native';
import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import LayoutSelection from '../LayoutSelection';
import LayoutOption from '../LayoutOption';
import { Layout, mapStateToProps, OPTIONS_PER_ROW } from '../Layout';

jest.spyOn(Dimensions, 'get');

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = merge => {
    const dimensions = { height: 630, width: 360 };
    const props = {
      renderReservedSpace: LayoutSelection,
      renderEmptySpace: LayoutOption,
      setDragActiveState: jest.fn(),
      createCellGroup: jest.fn(),
      onCellLayout: jest.fn(),
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
    const size = dimensions.width / OPTIONS_PER_ROW;

    const output = shallow(<Layout {...props} />);
    return {
      dimensions,
      output,
      props,
      size,
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
      active: { '1:0': true },
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

    const { output, size } = setup({
      reserved: [reserved],
    });

    const selection = output.find(LayoutSelection);

    expect(selection.props()).toMatchObject({
      height: reserved.height * size,
      width: reserved.width * size,
      left: reserved.x * size,
      top: reserved.y * size,
    });
  });

  it('does not bleed reserved data', () => {
    const { output, size } = setup({
      reserved: [
        { x: 0, y: 0, width: 2, height: 1, group: '1' },
        { x: 0, y: 1, width: 1, height: 1, group: '2' },
      ],
    });

    const [one, two] = output.find(LayoutSelection).map(R.identity);

    expect(one.prop('left')).toBe(0);
    expect(two.prop('left')).toBe(0);

    expect(one.prop('top')).toBe(0);
    expect(two.prop('top')).toBe(size);
  });

  it('invokes the layout handler for each layout', () => {
    const { output, props } = setup();

    const layout = { fake: true };
    const invokeLayout = element =>
      element.simulate('layout', {
        nativeEvent: { layout },
      });

    const options = output.find(LayoutOption);
    const selections = output.find(LayoutSelection);

    options.forEach(invokeLayout);
    selections.forEach(invokeLayout);

    expect(props.onCellLayout).toHaveBeenCalledWith(expect.any(String), {
      type: expect.any(String),
      layout,
    });

    const calls = options.length + selections.length;
    expect(props.onCellLayout).toHaveBeenCalledTimes(calls);
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
