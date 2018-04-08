import { shallow } from 'enzyme';
import React from 'react';

import { Option } from '../Option';

describe('Option', () => {
  const setup = merge => {
    const props = {
      onLayout: jest.fn(),
      active: false,
      height: 95,
      width: 90,
      left: 180,
      top: 90,
      ...merge,
    };

    return {
      output: shallow(<Option {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('uses the given dimensions', () => {
    const { output, props } = setup();
    const { height, width, left, top } = props;

    const inline = output.prop('style');
    expect(inline).toMatchObject({ height, width, left, top });
  });

  it('applies the active class when active', () => {
    const { output, props } = setup({ active: true });

    expect(output.prop('active')).toBe(props.active);
  });

  it('passes through onLayout', () => {
    const { output, props } = setup();

    expect(output.prop('onLayout')).toBe(props.onLayout);
  });
});
