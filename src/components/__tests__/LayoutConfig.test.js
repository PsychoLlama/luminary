import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import {
  mapStateToProps,
  LayoutConfig,
  GroupOption,
  SaveButton,
} from '../LayoutConfig';

describe('LayoutConfig', () => {
  const setup = merge => {
    const props = {
      createGrouping: jest.fn(),
      updateGrouping: jest.fn(),
      selectOption: jest.fn(),
      isNewGroup: true,
      selected: '2',
      groups: [
        { id: '1', name: 'Hall' },
        { id: '2', name: 'Kitchen' },
        { id: '3', name: 'Living Room' },
      ],
      navigation: {
        goBack: jest.fn(),
      },
      ...merge,
    };

    return {
      output: shallow(<LayoutConfig {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('shows all the group options', () => {
    const { output, props } = setup();
    const options = output.find(GroupOption);

    const expected = props.groups.length;
    expect(options.length).toBe(expected);
  });

  it('shows no selected group by default', () => {
    const { output, props } = setup({ selected: null });
    const options = output.find(GroupOption);

    expect.assertions(props.groups.length);
    options.forEach(option => expect(option.prop('selected')).toBe(false));
  });

  it('indicates which group is selected', () => {
    const { output } = setup();
    const options = output.find(GroupOption);

    expect(options.at(0).prop('selected')).toBe(false);
    expect(options.at(1).prop('selected')).toBe(true);
    expect(options.at(2).prop('selected')).toBe(false);
  });

  it('disables the button by default', () => {
    const { output } = setup({ selected: null });
    const button = output.find(SaveButton);

    expect(button.prop('disabled')).toBe(true);
    expect(button.prop('title')).toMatch(/option/i);
  });

  it('enables the button once an option is selected', () => {
    const { output } = setup();
    const button = output.find(SaveButton);

    expect(button.prop('disabled')).toBe(false);
    expect(button.prop('title')).toMatch(/create/i);
  });

  it('selects the option when clicked', () => {
    const { output, props } = setup();
    const option = output.find(GroupOption).first();
    const { id } = option.props();
    option.simulate('select', id);

    expect(props.selectOption).toHaveBeenCalledWith(id);
  });

  it('does not doubly select the same option', () => {
    const selected = '8';
    const { output, props } = setup({ selected });
    const option = output.find(GroupOption).first();
    option.simulate('select', selected);

    expect(props.selectOption).not.toHaveBeenCalled();
  });

  it('reserves a slot when finished', () => {
    const { output, props } = setup();
    output.find(SaveButton).simulate('press');

    expect(props.createGrouping).toHaveBeenCalled();
    expect(props.navigation.goBack).toHaveBeenCalled();
  });

  it('updates the group when in edit mode', () => {
    const { output, props } = setup({ isNewGroup: false });
    output.find(SaveButton).simulate('press');

    expect(props.createGrouping).not.toHaveBeenCalled();
    expect(props.updateGrouping).toHaveBeenCalled();
    expect(props.navigation.goBack).toHaveBeenCalled();
  });

  describe('GroupOption', () => {
    const setup = merge => {
      const props = {
        title: 'Living Room',
        onSelect: jest.fn(),
        selected: false,
        id: '5',
        ...merge,
      };

      return {
        output: shallow(<GroupOption {...props} />),
        props,
      };
    };

    it('renders', () => {
      setup();
    });

    it('invokes onSelect when pressed', () => {
      const { output, props } = setup();
      output.simulate('press');

      expect(props.onSelect).toHaveBeenCalledWith(props.id);
    });
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        groups: {
          1: { id: '1', name: 'Hall', type: 'Room' },
          2: { id: '2', name: 'Kitchen', type: 'Room' },
          3: { id: '3', name: 'Living Room', type: 'Room' },
          4: { id: '4', name: 'Custom group for $lights', type: 'LightGroup' },
        },

        layout: {
          cellGroup: {
            isNewGroup: false,
            groupId: '18',
            selected: {},
          },
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state),
        state,
      };
    };

    it('works when nothing is defined', () => {
      const { props } = select({
        layout: { $set: {} },
      });

      expect(props).toEqual(expect.any(Object));
    });

    it('pulls the selected value from state', () => {
      const { props, state } = select();

      expect(props.selected).toBe(state.layout.cellGroup.groupId);
    });

    it('gets the list of groups', () => {
      const { props, state } = select();

      expect(props.groups).toEqual([
        state.groups[1],
        state.groups[2],
        state.groups[3],
      ]);
    });

    it('does not change the group reference between renders', () => {
      const { state } = select();
      const updates = { $set: state };

      expect(select(updates).props.groups).toBe(select(updates).props.groups);
    });

    it('indicates whether the operation is create or edit', () => {
      const { props, state } = select();

      expect(props.isNewGroup).toBe(state.layout.cellGroup.isNewGroup);
    });
  });
});
