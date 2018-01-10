import { shallow } from 'enzyme';
import React from 'react';

import { LayoutManager } from '../LayoutManager';
import Layout from '../Layout';

describe('LayoutManager', () => {
  const setup = merge => {
    const props = {
      navigation: {
        navigate: jest.fn(),
      },
      ...merge,
    };

    const output = shallow(<LayoutManager {...props} />);
    const dimensions = { top: 0, left: 0, height: 560, width: 300 };
    const event = { nativeEvent: { layout: dimensions } };
    output.simulate('layout', event);

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
});
