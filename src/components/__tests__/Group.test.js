import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import { Group, styles, mapStateToProps } from '../Group';

describe('Group', () => {
  const isContainer = element => {
    const style = element.prop('style');
    if (!R.is(Function, R.prop('some', style))) return false;

    return style.some(R.equals(styles.container));
  };

  const setup = merge => {
    const props = {
      serverUrl: 'http://filament/',
      toggleLights: jest.fn(),
      height: 90,
      width: 60,
      left: 30,
      top: 0,
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
    const style = output.findWhere(isContainer).prop('style');

    expect(style).toContain(styles.on);
  });

  it('shows when the group is offline', () => {
    const { output } = setup({
      group: {
        anyOn: false,
        name: 'Hall',
        id: '3',
      },
    });

    const style = output.findWhere(isContainer).prop('style');

    expect(style).toContain(styles.off);
  });

  it('toggles the group when tapped', () => {
    const { output, props } = setup();
    output.simulate('press');

    expect(props.toggleLights).toHaveBeenCalledWith(props.serverUrl, {
      on: !props.group.anyOn,
      id: props.group.id,
    });
  });

  it('shows inline styles', () => {
    const { output, props } = setup();
    const container = output.findWhere(isContainer);

    const inline = R.last(container.prop('style'));

    expect(inline).toMatchObject({
      height: props.height,
      width: props.width,
      left: props.left,
      top: props.top,
    });
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}, props = { id: '1:1' }) => {
      const defaultState = {
        server: { url: 'http://filament/' },
        layout: {
          reserved: {
            '1:1': {
              group: '16',
            },
          },
        },
        groups: {
          16: {
            name: 'Group One',
            type: 'Room',
            id: '1',
          },
        },
      };

      const state = update(defaultState, updates);
      const groupId = R.path(['layout', 'reserved', props.id, 'group'], state);

      return {
        props: mapStateToProps(state, props),
        ownProps: props,
        groupId,
        state,
      };
    };

    it('works when nothing is defined', () => {
      const { props } = select({
        groups: { $set: undefined },
        layout: { $set: undefined },
      });

      expect(props).toEqual(expect.any(Object));
    });

    it('extracts the group from state', () => {
      const { props, state, groupId } = select();

      expect(props.group).toBe(state.groups[groupId]);
    });

    it('pulls the server URL from redux', () => {
      const { props, state } = select();

      expect(props.serverUrl).toBe(state.server.url);
    });
  });
});
