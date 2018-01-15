import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import React from 'react';

import * as colors from '../constants/colors';

export const Container = styled.View`
  background-color: ${colors.groups.bg};
  border: 0.5px solid ${colors.groups.divider};
  position: absolute;

  ${props =>
    props.active &&
    `
    background-color: ${colors.groups.selected};
  `};
`;

export class LayoutOption extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    onLayout: PropTypes.func,
  };

  render() {
    const { width, height, left, top, active, onLayout } = this.props;
    const inline = { width, height, left, top };

    return <Container active={active} onLayout={onLayout} style={inline} />;
  }
}

export default LayoutOption;
