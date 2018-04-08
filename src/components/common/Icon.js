import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import React from 'react';
import R from 'ramda';

import PropTypes from 'prop-types';

const OFFSET = '16px';
const OFFSETS = {
  RIGHT: 'right',
  LEFT: 'left',
  BOTH: 'both',
  NONE: 'none',
};

export const Container = styled.View`
  margin-right: ${props => (props.offsetRight ? OFFSET : 0)};
  margin-left: ${props => (props.offsetLeft ? OFFSET : 0)};
`;

export class Icon extends React.Component {
  static propTypes = {
    offset: PropTypes.oneOf(R.values(OFFSETS)),
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
  };

  static defaultProps = {
    offset: 'right',
  };

  render() {
    const { offset, ...props } = this.props;
    const isBoth = offset === OFFSETS.BOTH;
    const offsetRight = offset === OFFSETS.RIGHT || isBoth;
    const offsetLeft = offset === OFFSETS.LEFT || isBoth;

    return (
      <Container offsetRight={offsetRight} offsetLeft={offsetLeft}>
        <FontAwesome {...props} />
      </Container>
    );
  }
}

export default Icon;
