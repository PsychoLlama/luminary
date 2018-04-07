import { TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import React from 'react';

import { AppSettings } from '../AppSettings';

describe('AppSettings', () => {
  const setup = merge => {
    const props = {
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

  it('opens navigation on things', () => {
    const { output, props } = setup();

    output.find(TouchableOpacity).simulate('press');

    expect(props.navigation.navigate).toHaveBeenCalledWith('LayoutManager');
  });
});
