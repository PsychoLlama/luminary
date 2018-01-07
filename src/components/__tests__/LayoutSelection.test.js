import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import { LayoutSelection } from '../LayoutSelection';

describe('LayoutSelection', () => {
  const setup = merge => {
    const props = {
      onLayout: jest.fn(),
      height: 16,
      width: 8,
      left: 4,
      top: 2,
      ...merge,
    };

    return {
      output: shallow(<LayoutSelection {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('uses the given coordinates', () => {
    const { output, props } = setup();
    const [inline] = output.prop('style').slice(-1);
    const dimensions = R.pick(['top', 'left', 'width', 'height'], props);

    expect(inline).toMatchObject(dimensions);
  });

  it('passes through onLayout', () => {
    const { output, props } = setup();

    expect(output.prop('onLayout')).toBe(props.onLayout);
  });
});
