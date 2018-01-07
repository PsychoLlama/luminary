import { View } from 'react-native';
import { connect } from 'react-redux';
import React from 'react';

export class LayoutConfig extends React.Component {
  render() {
    return <View />;
  }
}

export const mapStateToProps = () => ({});

export default connect(mapStateToProps)(LayoutConfig);
