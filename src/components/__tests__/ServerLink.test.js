import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { ServerLink, mapStateToProps } from '../ServerLink';

describe('ServerLink', () => {
  const setup = merge => {
    const props = {
      getServerUrl: jest.fn(),
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

  it('shows nothing while checking local storage', () => {
    const { output } = setup();

    expect(output.equals(null)).toBe(true);
    expect(output.state()).toMatchObject({
      gotResponse: false,
      address: null,
    });
  });

  it('fetches the address when mounting', async () => {
    const { output, props } = setup();

    await output.instance().componentDidMount();
    expect(props.getServerUrl).toHaveBeenCalled();
  });

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        filamentServerUrl: 'http://some-url.tld',
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

      expect(props.serverUrl).toBe(state.filamentServerUrl);
    });
  });
});
