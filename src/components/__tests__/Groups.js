import { shallow } from 'enzyme';
import React from 'react';

import { Groups } from '../Groups';
import Group from '../Group';

const createGroup = (fields = {}) => ({
  state: { on: false },
  name: 'Living room',
  id: 2,


  ...fields,
});

describe('<Groups>', () => {
  let props;
  const setup = () => shallow(<Groups {...props} />);

  beforeEach(() => {
    props = {
      data: {
        loading: false,
        groups: [
          createGroup({ id: 1 }),
          createGroup({ id: 2 }),
        ],
      },
    };
  });

  it('shows all the groups', () => {
    const groups = setup().find(Group);

    expect(groups.length).toBe(props.data.groups.length);
  });

  it('does not show groups if they are still loading', () => {
    props.data.loading = true;
    const groups = setup().find(Group);

    expect(groups.length).toBe(0);
  });

  it('shows the group name', () => {
    const group = setup().find(Group).first();

    expect(group.prop('children')).toContain(props.data.groups[0].name);
  });
});
