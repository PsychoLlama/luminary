import { shallow } from 'enzyme';
import React from 'react';

import { Group } from '../Group';

describe('<Group>', () => {
  let props;
  const setup = () => shallow(<Group {...props} />);

  beforeEach(() => {
    props = {
      children: 'Hall',
    };
  });

  it('shows the group name', () => {
    const name = setup().find('Text').prop('children');

    expect(name).toContain(props.children);
  });
});
