import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { Groups, mapStateToProps } from '../Groups';
import Layout from '../Layout';
import Group from '../Group';

const createGroup = (fields = {}) => ({
  name: 'Living room',
  anyOn: false,
  type: 'Room',
  id: '2',

  ...fields,
});

describe('Groups', () => {
  const setup = merge => {
    const props = {
      serverUrl: 'http://filament/',
      fetchAllGroups: jest.fn(),
      groups: ['1', '2'],
      ...merge,
    };

    const output = shallow(<Groups {...props} />);
    const dimensions = { width: 360, height: 560 };
    const event = { nativeEvent: { layout: dimensions } };
    output.simulate('layout', event);

    return {
      dimensions,
      output,
      props,
    };
  };

  it('fetches groups on mount', () => {
    const { output, props } = setup({ groups: [] });

    output.instance().componentDidMount();
    expect(props.fetchAllGroups).toHaveBeenCalledWith(props.serverUrl);
  });

  it('renders a layout', () => {
    const { output } = setup();
    const layout = output.find(Layout);

    expect(layout.exists()).toBe(true);
    expect(layout.prop('renderReservedSpace')).toBe(Group);
    expect(layout.prop('renderEmptySpace')).toEqual(expect.any(Function));
  });

  it('passes the computed layout', () => {
    const { output, dimensions } = setup();
    const layout = output.find(Layout);

    expect(layout.prop('container')).toBe(dimensions);
  });

  describe('edit button', () => {
    const setup = merge => {
      const props = {
        navigation: {
          navigate: jest.fn(),
        },
        ...merge,
      };

      const options = Groups.navigationOptions(props);

      return {
        node: options.headerRight,
        props,
      };
    };

    it('renders', () => {
      setup();
    });

    it('navigates on press', () => {
      const { node, props } = setup();
      node.props.onPress();

      expect(props.navigation.navigate).toHaveBeenCalledWith('LayoutManager');
    });
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        server: { url: 'http://filament/' },
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

    it('grabs the filament server address', () => {
      const { props, state } = select();

      expect(props.serverUrl).toBe(state.server.url);
    });
  });
});
