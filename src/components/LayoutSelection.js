import { View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

export class LayoutSelection extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  };

  render() {
    const inline = R.pick(['height', 'width', 'left', 'top'], this.props);

    return <View style={[inline]} />;
  }
}

export default LayoutSelection;
