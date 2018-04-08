import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

// eslint-disable-next-line import/named
import { KeepAwake } from 'expo';

import { DashboardDetector, mapStateToProps } from '../DashboardDetector';
import { DASHBOARD_MODE } from '../../reducers/switches';

jest.useFakeTimers();

describe('DashboardDetector', () => {
  const setup = merge => {
    const props = {
      serverUrl: 'http://filament.server',
      fetchAllGroups: jest.fn().mockReturnValue(Promise.resolve()),
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

  it('refetches light state periodically', () => {
    const { props } = setup();

    expect(props.fetchAllGroups).not.toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(props.fetchAllGroups).toHaveBeenCalledWith(props.serverUrl);
  });

  it('does not refetch if dashboard mode is disabled', () => {
    const { props } = setup({ enabled: false });

    jest.runOnlyPendingTimers();
    expect(props.fetchAllGroups).not.toHaveBeenCalled();
  });

  it('self-schedules following refetches', () => {
    const { props } = setup();
    props.fetchAllGroups.mockReturnValue({
      then: cb => cb(),
    });

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(props.fetchAllGroups).toHaveBeenCalledTimes(2);
  });

  it('continues to fetch automatically after failed fetches', () => {
    const { props } = setup();
    props.fetchAllGroups.mockReturnValue({
      then: (done, catcher) => catcher(),
    });

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(props.fetchAllGroups).toHaveBeenCalledTimes(2);
  });

  it('stops fetching after unmounting', () => {
    const { output, props } = setup();
    output.instance().componentWillUnmount();

    jest.runOnlyPendingTimers();

    expect(props.fetchAllGroups).not.toHaveBeenCalled();
  });

  // Because apparently react-navigation NEVER UNMOUNTS!
  it('starts refetching if enabled while mounted', () => {
    const { output, props } = setup({ enabled: false });

    output.setProps({ enabled: true });
    jest.runOnlyPendingTimers();

    expect(props.fetchAllGroups).toHaveBeenCalled();
  });

  it('stops refetching if disabled while mounted', () => {
    const { output, props } = setup();

    output.setProps({ enabled: false });
    jest.runOnlyPendingTimers();

    expect(props.fetchAllGroups).not.toHaveBeenCalled();
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
