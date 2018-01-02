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

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        server: {
          url: 'http://some-url.tld',
          state: STATES.LOADING,
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
  });
});
