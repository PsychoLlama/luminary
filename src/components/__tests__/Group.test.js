import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import { Group, styles, mapStateToProps } from '../Group';

describe('Group', () => {
  const hasStyle = style => element => {
    const styled = element.prop('style');
    if (!styled) return false;
    if (styled === style) return true;
    if (Array.isArray(styled)) return R.any(R.equals(style), styled);
    return false;
  };

  const isContainer = hasStyle(styles.container);
  const isTitle = hasStyle(styles.title);

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

  it('shows a smaller title for constrained blocks', () => {
    const { output } = setup({ blockWidth: 1 });
    const title = output.findWhere(isTitle);

    expect(title.prop('style')).toContain(styles.smallTitle);
  });

  it('shows large title size for spaces that can fit', () => {
    const { output } = setup();
    const title = output.findWhere(isTitle);

    expect(title.prop('style')).not.toContain(styles.smallTitle);
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
