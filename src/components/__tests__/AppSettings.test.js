import { Switch, TouchableOpacity } from 'react-native';
import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { AppSettings, mapStateToProps } from '../AppSettings';
import { DASHBOARD_MODE } from '../../reducers/switches';

describe('AppSettings', () => {
  const setup = merge => {
    const props = {
      switches: { [DASHBOARD_MODE]: true, dragons: false },
      persistSwitches: jest.fn(),
      toggleSwitch: jest.fn(),
      navigation: {
        navigate: jest.fn(),
      },
      ...merge,
    };

    return {
      output: shallow(<AppSettings {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('opens layout configuration when chosen', () => {
    const { output, props } = setup();

    output
      .find(TouchableOpacity)
      .at(0)
      .simulate('press');

    expect(props.navigation.navigate).toHaveBeenCalledWith('LayoutManager');
  });

  it('opens server config when chosen', () => {
    const { output, props } = setup();

    output
      .find(TouchableOpacity)
      .at(1)
      .simulate('press');

    expect(props.navigation.navigate).toHaveBeenCalledWith('ServerLink');
  });

  it('enables dashboard mode when the toggle is set', () => {
    const { output, props } = setup();
    output.find(Switch).simulate('valueChange', false);

    expect(props.toggleSwitch).toHaveBeenCalledWith({
      name: DASHBOARD_MODE,
      on: false,
    });
  });

  it('persists the switches after changing them', () => {
    const { output, props } = setup();
    output.find(Switch).simulate('valueChange', false);

    expect(props.persistSwitches).toHaveBeenCalledWith({
      ...props.switches,
      [DASHBOARD_MODE]: false,
    });
  });

  it('indicates if the switch is enabled', () => {
    const { output, props } = setup();
    const enabled = output.find(Switch).prop('value');

    expect(enabled).toBe(props.switches[DASHBOARD_MODE]);
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        switches: {
          [DASHBOARD_MODE]: true,
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state),
        state,
      };
    };

    it('gets the feature switches', () => {
      const { props, state } = select();

      expect(props).toMatchObject({
        switches: state.switches,
      });
    });
  });
});
