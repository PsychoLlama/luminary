import { shallow } from 'enzyme';
import React from 'react';

import { Groups } from '../Groups';
import Group from '../Group';

const createGroup = (fields = {}) => ({
  state: { on: false },
  name: 'Living room',
  type: 'Room',
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

  it('passes the group to the group component', () => {
    const groups = setup().find(Group).first();

    expect(groups.prop('group')).toEqual(props.data.groups[0]);
  });

  it('puts a middle divider on every second component', () => {
    const groups = setup().find(Group);

    expect(groups.at(0).prop('divide')).toBe(true);
    expect(groups.at(1).prop('divide')).toBe(false);
  });

  it('only shows room types', () => {
    props.data.groups.push(createGroup({ type: 'LightGroup' }));
    const groups = setup().find(Group);

    expect(groups.length).toBe(props.data.groups.length - 1);
  });

  it('shows errors', () => {
    props.data.groups = undefined;
    props.data.error = {
      message: 'Fire bad.',
      networkError: {},
    };

    const message = setup().find('Text').prop('children');

    expect(message).toContain(props.data.error.message);
  });
});
