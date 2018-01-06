import { Dimensions } from 'react-native';
import { shallow } from 'enzyme';
import React from 'react';

import { LayoutManager } from '../LayoutManager';
import LayoutOption from '../LayoutOption';

jest.spyOn(Dimensions, 'get');

describe('LayoutManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = merge => {
    const props = {
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

    const optionsPerRow = 4;
    const rows = dimensions.height / (dimensions.width / optionsPerRow);
    const expected = Math.floor(rows * optionsPerRow);

    expect(options.length).toBe(expected);
  });

  it('sets the proper size', () => {
    const { output, dimensions } = setup();
    const option = output.find(LayoutOption).first();

    expect(option.prop('width')).toBe(dimensions.width / 4);
    expect(option.prop('height')).toBe(dimensions.width / 4);
  });

  it('sets the proper position', () => {
    const { output, dimensions } = setup();

    const width = dimensions.width / 4;
    // 4th from the top.
    const top = width * 3;
    // 3rd from the left.
    const left = width * 2;

    const option = output.find(LayoutOption).at(14);

    expect(option.prop('top')).toBe(top);
    expect(option.prop('left')).toBe(left);
  });
});
