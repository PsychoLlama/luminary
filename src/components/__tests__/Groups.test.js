import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { Groups, mapStateToProps } from '../Groups';
import Group from '../Group';

const createGroup = (fields = {}) => ({
  name: 'Living room',
  anyOn: false,
  type: 'Room',
  id: '2',

  ...fields,
});

describe('<Groups>', () => {
  const setup = merge => {
    const props = {
      data: {
        groups: ['1', '2'],
      },

      ...merge,
    };

    return {
      output: shallow(<Groups {...props} />),
      props,
    };
  };

  it('shows all the groups', () => {
    const { output, props } = setup();
    const groups = output.find(Group);

    expect(groups.length).toBe(props.data.groups.length);
  });

  it('passes the group to the group component', () => {
    const { output, props } = setup();
    const groups = output.find(Group).first();

    expect(groups.prop('id')).toEqual(props.data.groups[0]);
  });

  it('puts a middle divider on every second component', () => {
    const { output } = setup();
    const groups = output.find(Group);

    expect(groups.at(0).prop('divide')).toBe(true);
    expect(groups.at(1).prop('divide')).toBe(false);
  });

  it('shows errors', () => {
    const { output, props } = setup({
      data: {
        error: {
          message: 'Fire bad.',
          networkError: {},
        },
      },
    });

    const message = output.find('Text').prop('children');

    expect(message).toContain(props.data.error.message);
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        groups: {
          1: createGroup({ name: 'One', id: '1' }),
          2: createGroup({ name: 'Two', id: '2' }),
          3: createGroup({ name: 'Three', id: '3' }),
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state),
        state,
      };
    };

    it('works', () => {
      const { props } = select();

      expect(props).toEqual(expect.any(Object));
    });

    it('extracts a list of group IDs', () => {
      const { props } = select();

      expect(props.groups).toEqual(['1', '2', '3']);
    });

    // Excludes arbitrary light groupings made by 3rd-party apps.
    it('only includes Room types', () => {
      const { props } = select({
        groups: {
          3: {
            type: { $set: 'LightGroup' },
          },
        },
      });

      expect(props.groups).toEqual(['1', '2']);
    });
  });
});
