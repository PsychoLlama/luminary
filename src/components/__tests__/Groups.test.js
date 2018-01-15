import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { Groups, SetupTitle, SetupButton, mapStateToProps } from '../Groups';
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
      navigation: { navigate: jest.fn() },
      serverUrl: 'http://filament/',
      fetchAllGroups: jest.fn(),
      layoutsDefined: true,
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

  it('shows a message when no layouts are defined', () => {
    const { output } = setup({ layoutsDefined: false });
    const layout = output.find(Layout);
    const title = output.find(SetupTitle);

    expect(layout.exists()).toBe(false);
    expect(title.exists()).toBe(true);
  });

  it('navigates to layout on setup', () => {
    const { output, props } = setup({ layoutsDefined: false });
    output.find(SetupButton).simulate('press');

    expect(props.navigation.navigate).toHaveBeenCalledWith('LayoutManager');
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
        layout: {
          reserved: {
            '1:1': { x: 1, y: 1, width: 1, height: 1, group: '5' },
          },
        },
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

    it('grabs the filament server address', () => {
      const { props, state } = select();

      expect(props.serverUrl).toBe(state.server.url);
    });

    it('indicates if layouts exist', () => {
      const { props } = select();

      expect(props.layoutsDefined).toBe(true);
    });

    it('indicates if layouts are absent', () => {
      const { props } = select({
        layout: {
          reserved: { $set: {} },
        },
      });

      expect(props.layoutsDefined).toBe(false);
    });
  });
});
