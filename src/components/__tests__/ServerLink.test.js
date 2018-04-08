import { Button } from 'react-native';
import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { ServerLink, UrlInput, mapStateToProps } from '../ServerLink';
import { error } from '../../constants/colors';

describe('ServerLink', () => {
  const setup = merge => {
    const props = {
      navigation: { navigate: jest.fn(), goBack: jest.fn() },
      pingServer: jest.fn(() => Promise.resolve()),
      serverUrl: 'http://filament/',
      updateServerUrl: jest.fn(),
      urlLooksValid: true,
      ...merge,
    };

    return {
      output: shallow(<ServerLink {...props} />),
      props,
    };
  };

  it('renders', () => {
    setup();
  });

  it('shows the groups if the ping was successful', async () => {
    const { output, props } = setup({
      pingServer: jest.fn(() =>
        Promise.resolve({ payload: { success: true } }),
      ),
    });

    await output.find(Button).prop('onPress')();

    expect(props.navigation.navigate).toHaveBeenCalledWith('Groups');
  });

  it('does not redirect to groups if unsuccessful', async () => {
    const { output, props } = setup({
      pingServer: jest.fn(() => Promise.resolve({ payload: null })),
    });

    await output.find(Button).prop('onPress')();

    expect(props.navigation.navigate).not.toHaveBeenCalled();
  });

  it('shows an input element', () => {
    const { output } = setup();
    const text = output.find(UrlInput);

    expect(text.exists()).toBe(true);
  });

  it('updates the server URL on input', () => {
    const { output, props } = setup();
    const url = 'http://';
    output.find(UrlInput).simulate('changeText', url);

    expect(props.updateServerUrl).toHaveBeenCalledWith(url);
  });

  it('shows a button', () => {
    const { output } = setup();
    const button = output.find(Button);

    expect(button.exists()).toBe(true);
    expect(button.prop('disabled')).toBe(false);
  });

  it('disables the button if the URL looks invalid', () => {
    const { output } = setup({ urlLooksValid: false });
    const button = output.find(Button);

    expect(button.prop('disabled')).toBe(true);
  });

  it('pings the server when submitting', () => {
    const { output, props } = setup();
    output.find(Button).simulate('press');

    expect(props.pingServer).toHaveBeenCalledWith(props.serverUrl);
  });

  it('pings the server when the submit button is pressed', () => {
    const { output, props } = setup();
    output.find(UrlInput).simulate('submitEditing');

    expect(props.pingServer).toHaveBeenCalledWith(props.serverUrl);
  });

  it('does not ping the server if the url is invalid', () => {
    const { output, props } = setup({ urlLooksValid: false });
    output.find(UrlInput).simulate('submitEditing');

    expect(props.pingServer).not.toHaveBeenCalled();
  });

  it('disables submit while pinging', () => {
    const { output, props } = setup({ testingConnection: true });
    output.find(UrlInput).simulate('submitEditing');
    const button = output.find(Button);

    expect(props.pingServer).not.toHaveBeenCalled();
    expect(button.prop('disabled')).toBe(true);
    expect(button.prop('title')).toMatch(/testing/i);
  });

  it('indicates if the last request failed', () => {
    const { output } = setup({ pingSuccessful: false });
    const button = output.find(Button);

    expect(button.prop('color')).toBe(error);
    expect(button.prop('title')).toMatch(/failed/i);
  });

  it('does not show an error state when no request has been sent', () => {
    const { output } = setup();
    const button = output.find(Button);

    expect(button.prop('color')).not.toBe(error);
  });

  it('unwinds navigation history if requested', async () => {
    const { output, props } = setup({
      pingServer: () => Promise.resolve({ payload: { success: true } }),
      navigation: {
        state: { params: { goBack: true } },
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
    });

    await output.find(Button).prop('onPress')();

    expect(props.navigation.navigate).not.toHaveBeenCalled();
    expect(props.navigation.goBack).toHaveBeenCalled();
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        server: {
          url: 'http://some-url.tld',
          testingConnection: true,
          pingSuccessful: false,
          urlLooksValid: true,
        },
      };

      const state = update(defaultState, updates);

      return {
        props: mapStateToProps(state),
        state,
      };
    };

    it('works', () => {
      const { props } = select();

      expect(props).toEqual(expect.any(Object));
    });

    it('retrieves the server URL', () => {
      const { props, state } = select();

      expect(props.serverUrl).toBe(state.server.url);
    });

    it('indicates whether the url looks valid', () => {
      const { props, state } = select();

      expect(props.urlLooksValid).toBe(state.server.urlLooksValid);
    });

    it('indicates if the server is being pinged', () => {
      const { props, state } = select();

      expect(props.testingConnection).toBe(state.server.testingConnection);
    });

    it('shows the ping success state', () => {
      const { props, state } = select();

      expect(props.pingSuccessful).toBe(state.server.pingSuccessful);
    });
  });
});
