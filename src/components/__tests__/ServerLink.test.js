import { TextInput, Button } from 'react-native';
import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { ServerLink, mapStateToProps } from '../ServerLink';
import { STATES } from '../../reducers/filament';
import Groups from '../Groups';

describe('ServerLink', () => {
  const setup = merge => {
    const props = {
      lookupState: STATES.NOT_FOUND,
      updateServerUrl: jest.fn(),
      getServerUrl: jest.fn(),
      pingServer: jest.fn(),
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

  it('fetches the address when mounting', async () => {
    const { output, props } = setup();

    await output.instance().componentDidMount();
    expect(props.getServerUrl).toHaveBeenCalled();
  });

  it('shows nothing while loading', () => {
    const { output } = setup({ lookupState: STATES.LOADING });

    expect(output.equals(null)).toBe(true);
  });

  it('shows the groups if the server URL was found', () => {
    const { output } = setup({ lookupState: STATES.FOUND });

    expect(output.find(Groups).exists()).toBe(true);
  });

  it('shows an input element', () => {
    const { output } = setup();
    const text = output.find(TextInput);

    expect(text.exists()).toBe(true);
  });

  it('updates the server URL on input', () => {
    const { output, props } = setup();
    const url = 'http://';
    output.find(TextInput).simulate('changeText', url);

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
    output.find(TextInput).simulate('submitEditing');

    expect(props.pingServer).toHaveBeenCalledWith(props.serverUrl);
  });

  it('does not ping the server if the url is invalid', () => {
    const { output, props } = setup({ urlLooksValid: false });
    output.find(TextInput).simulate('submitEditing');

    expect(props.pingServer).not.toHaveBeenCalled();
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        server: {
          url: 'http://some-url.tld',
          state: STATES.LOADING,
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

    it('fetches the server URL lookup state', () => {
      const { props, state } = select();

      expect(props.lookupState).toBe(state.server.state);
    });

    it('indicates whether the url looks valid', () => {
      const { props, state } = select();

      expect(props.urlLooksValid).toBe(state.server.urlLooksValid);
    });
  });
});
