import update from 'immutability-helper';
import { shallow } from 'enzyme';
import React from 'react';

import { LayoutConfig, mapStateToProps } from '../LayoutConfig';

describe('LayoutConfig', () => {
  const setup = merge => {
    const props = {
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

  describe('mapStateToProps', () => {
    const select = (updates = {}) => {
      const defaultState = {
        layout: {
          newCellGroup: {
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
  });
});
