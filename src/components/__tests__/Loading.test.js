import { NavigationActions } from 'react-navigation';
import { shallow } from 'enzyme';
import React from 'react';

import { Loading } from '../Loading';

describe('Loading', () => {
  const setup = merge => {
    const props = {
      getServerUrl: jest.fn(() => Promise.resolve({})),
      getLayouts: jest.fn(),
      navigation: {
        dispatch: jest.fn(),
      },
      ...merge,
    };

    return {
      output: shallow(<Loading {...props} />),
      props,
    };
  };

  it('works', () => {
    setup();
  });

  it('fetches the server URL on mount', async () => {
    const { props, output } = setup();

    await output.instance().componentWillMount();

    expect(props.getServerUrl).toHaveBeenCalled();
  });

  it('fetches the layouts on mount', () => {
    const { props } = setup();

    expect(props.getLayouts).toHaveBeenCalled();
  });

  it('shows the groups on success', async () => {
    const { props, output } = setup({
      getServerUrl: jest.fn(() =>
        Promise.resolve({ payload: 'http://server/' }),
      ),
    });

    await output.instance().componentWillMount();

    expect(props.navigation.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        actions: [NavigationActions.navigate({ routeName: 'Groups' })],
      }),
    );
  });

  it('shows the server setup page on failure', async () => {
    const { props, output } = setup({
      getServerUrl: jest.fn(() => Promise.resolve({ payload: null })),
    });

    await output.instance().componentWillMount();

    expect(props.navigation.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        actions: [NavigationActions.navigate({ routeName: 'ServerLink' })],
      }),
    );
  });
});
