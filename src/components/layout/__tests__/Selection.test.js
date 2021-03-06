import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';
import R from 'ramda';

import { mapStateToProps, Container, Selection, Title } from '../Selection';

describe('Selection', () => {
  const setup = merge => {
    const props = {
      isPartOfInvalidSelection: false,
      groupTitle: 'Living Room',
      onLayout: jest.fn(),
      blockWidth: 2,
      height: 16,
      width: 8,
      left: 4,
      top: 2,
      ...merge,
    };

    return {
      output: shallow(<Selection {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('uses the given coordinates', () => {
    const { output, props } = setup();
    const container = output.find(Container);
    const inline = container.prop('style');
    const dimensions = R.pick(['top', 'left', 'width', 'height'], props);

    expect(inline).toMatchObject(dimensions);
  });

  it('passes through onLayout', () => {
    const { output, props } = setup();
    const container = output.find(Container);

    expect(container.prop('onLayout')).toBe(props.onLayout);
  });

  it('shows the group name', () => {
    const { output, props } = setup();
    const title = output.find(Title);

    expect(title.prop('children')).toBe(props.groupTitle);
  });

  it('shows a smaller group name when constrained', () => {
    const { output } = setup({ blockWidth: 1 });
    const title = output.find(Title);

    expect(title.prop('small')).toBe(true);
  });

  it('shows a large group name when possible', () => {
    const { output } = setup({ blockWidth: 2 });
    const title = output.find(Title);

    expect(title.prop('small')).toBe(false);
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}, ownProps = { id: '2:4' }) => {
      const groupId = '6';
      const defaultState = {
        layout: {
          reserved: {
            [ownProps.id]: {
              group: groupId,
              height: 2,
              width: 1,
              x: 2,
              y: 4,
            },
          },
        },
        groups: {
          [groupId]: {
            name: 'Group name',
          },
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state, ownProps),
        ownProps,
        groupId,
        state,
      };
    };

    it('works when nothing is defined', () => {
      const { props } = select({
        layout: { $set: null },
        groups: { $set: null },
      });

      expect(props).toEqual(expect.any(Object));
    });

    it('fetches the group name', () => {
      const { props, state, groupId } = select();

      expect(props.groupTitle).toBe(state.groups[groupId].name);
    });

    it('fetches the layout width', () => {
      const { props, state, ownProps } = select();

      const expected = state.layout.reserved[ownProps.id].width;
      expect(props.blockWidth).toBe(expected);
    });
  });
});
