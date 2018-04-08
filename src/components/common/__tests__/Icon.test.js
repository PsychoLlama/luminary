import { FontAwesome } from '@expo/vector-icons';
import { shallow } from 'enzyme';
import React from 'react';

import { Icon, Container } from '../Icon';

describe('Icon', () => {
  const setup = merge => {
    const props = {
      offset: 'right',
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

    const { offset, ...expected } = props;
    expect(icon.props()).toMatchObject(expected);
  });

  it('strips out the offset prop', () => {
    const { output } = setup();
    const icon = output.find(FontAwesome);

    expect(icon.prop('offset')).toBeUndefined();
  });

  it('uses the correct offset', () => {
    const offset = offset => {
      const { output } = setup({ offset });
      const container = output.find(Container).dive();
      return container.prop('style')[0];
    };

    expect(offset('right')).toMatchObject({ marginRight: 16, marginLeft: 0 });
    expect(offset('left')).toMatchObject({ marginRight: 0, marginLeft: 16 });
    expect(offset('both')).toMatchObject({ marginRight: 16, marginLeft: 16 });
    expect(offset('none')).toMatchObject({ marginRight: 0, marginLeft: 0 });
  });
});
