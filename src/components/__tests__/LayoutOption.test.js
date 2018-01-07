import { shallow } from 'enzyme';
import React from 'react';

import { LayoutOption, styles } from '../LayoutOption';

describe('LayoutOption', () => {
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
      output: shallow(<LayoutOption {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('uses the given dimensions', () => {
    const { output, props } = setup();
    const { height, width, left, top } = props;

    // This test assumes the last style value is inline.
    const [inline] = output.prop('style').slice(-1);
    expect(inline).toMatchObject({ height, width, left, top });
  });

  it('applies the active class when active', () => {
    const { output } = setup({ active: true });

    expect(output.prop('style')).toContain(styles.selected);
  });

  it('passes through onLayout', () => {
    const { output, props } = setup();

    expect(output.prop('onLayout')).toBe(props.onLayout);
  });
});
