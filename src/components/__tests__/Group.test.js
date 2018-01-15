import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import { Group, Title, mapStateToProps, Container } from '../Group';

describe('Group', () => {
  const setup = merge => {
    const props = {
      serverUrl: 'http://filament/',
      toggleLights: jest.fn(),
      blockWidth: 2,
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
    const name = output.find(Title).prop('children');

    expect(name).toContain(props.group.name);
  });

  // The group ID can be known before the group is loaded.
  it('survives when the group is undefined', () => {
    const { output } = setup({ group: null });

    expect(output.exists()).toBe(true);
  });

  it('shows when the group is on', () => {
    const { output } = setup();
    const container = output.find(Container);

    expect(container.prop('on')).toBe(true);
  });

  it('shows when the group is off', () => {
    const { output } = setup({
      group: {
        name: 'Hall',
        anyOn: false,
        id: '3',
      },
    });

    const container = output.find(Container);

    expect(container.prop('on')).toBe(false);
  });

  it('toggles the group when tapped', () => {
    const { output, props } = setup();
    output.simulate('press');

    expect(props.toggleLights).toHaveBeenCalledWith(props.serverUrl, {
      on: !props.group.anyOn,
      id: props.group.id,
    });
  });

  it('correctly positions the group', () => {
    const { output, props } = setup();
    const container = output.find(Container);
    const inline = container.prop('style');

    expect(inline).toMatchObject({
      height: props.height,
      width: props.width,
      left: props.left,
      top: props.top,
    });
  });

  it('shows a smaller title for constrained blocks', () => {
    const { output } = setup({ blockWidth: 1 });
    const title = output.find(Title);

    expect(title.prop('small')).toBe(true);
  });

  it('shows large title size for spaces that can fit', () => {
    const { output } = setup();
    const title = output.find(Title);

    expect(title.prop('small')).toBe(false);
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}, props = { id: '1:1' }) => {
      const defaultState = {
        server: { url: 'http://filament/' },
        layout: {
          reserved: {
            '1:1': {
              group: '16',
              height: 1,
              width: 2,
              x: 1,
              y: 1,
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

    it('fetches the width unit', () => {
      const { props, state, ownProps } = select();

      const expected = state.layout.reserved[ownProps.id].width;
      expect(props.blockWidth).toBe(expected);
    });
  });
});
