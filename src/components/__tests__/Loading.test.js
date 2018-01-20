import { NavigationActions } from 'react-navigation';
import { shallow } from 'enzyme';
import React from 'react';

import { Loading } from '../Loading';

describe('Loading', () => {
  const setup = merge => {
    const props = {
      getAppState: jest.fn(),
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

  it('fetches app state on mount from storage', () => {
    const { props } = setup();

    expect(props.getAppState).toHaveBeenCalled();
  });

  it('shows the groups on success', async () => {
    const { props, output } = setup({
      getAppState: jest.fn(async () => ({
        payload: { serverUrl: 'http://server/' },
      })),
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
      getAppState: jest.fn(async () => ({
        payload: { serverUrl: null },
      })),
    });

    await output.instance().componentWillMount();

    expect(props.navigation.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        actions: [NavigationActions.navigate({ routeName: 'ServerLink' })],
      }),
    );
  });
});
