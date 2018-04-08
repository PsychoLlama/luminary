import { FontAwesome } from '@expo/vector-icons';
import { shallow } from 'enzyme';
import React from 'react';

import { Icon } from '../Icon';

describe('Icon', () => {
  const setup = merge => {
    const props = {
      color: 'blue',
      name: 'gear',
      ...merge,
    };

    return {
      output: shallow(<Icon {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('shows an icon', () => {
    const { output, props } = setup();
    const icon = output.find(FontAwesome);

    expect(icon.exists()).toBe(true);
    expect(icon.prop('name')).toBe(props.name);
  });

  it('passes all props through', () => {
    const { output, props } = setup({
      name: 'dashboard',
      bacon: 'enabled',
      size: 20,
    });

    const icon = output.find(FontAwesome);

    expect(icon.props()).toMatchObject(props);
  });
});
