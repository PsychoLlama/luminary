import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { Group, styles, mapStateToProps } from '../Group';

describe('Group', () => {
  const setup = merge => {
    const props = {
      serverUrl: 'http://filament/',
      toggleLights: jest.fn(),
      divide: false,
      group: {
        name: 'Hall',
        anyOn: true,
        id: '3',
      },

      ...merge,
    };

    return {
      output: shallow(<Group {...props} />),
      props,
    };
  };

  it('shows the group name', () => {
    const { output, props } = setup();
    const name = output.find('Text').prop('children');

    expect(name).toContain(props.group.name);
  });

  it('shows when the group is online', () => {
    const { output } = setup();
    const status = output.find({ style: [styles.status, styles.on] });

    expect(status.length).toBe(1);
  });

  it('shows when the group is offline', () => {
    const { output } = setup({
      group: {
        anyOn: false,
        name: 'Hall',
        id: '3',
      },
    });

    const status = output.find({ style: [styles.status, styles.off] });

    expect(status.length).toBe(1);
  });

  it('shows the divider if set', () => {
    const { output } = setup({ divide: true });
    const group = output.find({ style: [styles.title, styles.divide] });

    expect(group.length).toBe(1);
  });

  it('does not show the divider if not set', () => {
    const { output } = setup({ divide: false });
    const group = output.find({ style: [styles.title, styles.divide] });

    expect(group.length).toBe(0);
  });

  it('toggles the group when tapped', () => {
    const { output, props } = setup();
    output.simulate('press');

    expect(props.toggleLights).toHaveBeenCalledWith(props.serverUrl, {
      on: !props.group.anyOn,
      id: props.group.id,
    });
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}, props = { id: 1 }) => {
      const defaultState = {
        server: { url: 'http://filament/' },
        groups: {
          1: {
            name: 'Group One',
            type: 'Room',
            id: '1',
          },
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state, props),
        ownProps: props,
        state,
      };
    };

    it('works when nothing is defined', () => {
      const { props } = select({
        groups: { $set: undefined },
      });

      expect(props).toEqual(expect.any(Object));
    });

    it('extracts the group from state', () => {
      const { props, state, ownProps } = select();

      expect(props.group).toBe(state.groups[ownProps.id]);
    });

    it('pulls the server URL from redux', () => {
      const { props, state } = select();

      expect(props.serverUrl).toBe(state.server.url);
    });
  });
});
