import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

// eslint-disable-next-line import/named
import { KeepAwake } from 'expo';

import { DashboardDetector, mapStateToProps } from '../DashboardDetector';
import { DASHBOARD_MODE } from '../../reducers/switches';

describe('DashboardDetector', () => {
  const setup = merge => {
    const props = {
      enabled: true,
      ...merge,
    };

    return {
      output: shallow(<DashboardDetector {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('keeps the screen awake', () => {
    const { output } = setup();
    const keepawake = output.find(KeepAwake);

    expect(keepawake.exists()).toBe(true);
  });

  it('does not keep the screen awake when disabled', () => {
    const { output } = setup({ enabled: false });
    const keepawake = output.find(KeepAwake);

    expect(keepawake.exists()).toBe(false);
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        switches: {
          [DASHBOARD_MODE]: false,
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state),
        state,
      };
    };

    it('indicates whether dashboard mode is enabled', () => {
      const { props, state } = select();

      expect(props).toMatchObject({
        enabled: state.switches[DASHBOARD_MODE],
      });
    });
  });
});
