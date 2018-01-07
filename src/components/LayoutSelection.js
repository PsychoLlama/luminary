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
    onLayout: PropTypes.func,
  };

  render() {
    const inline = R.pick(['height', 'width', 'left', 'top'], this.props);

    return <View style={[inline]} onLayout={this.props.onLayout} />;
  }
}

export default LayoutSelection;
