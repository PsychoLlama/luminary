import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import React from 'react';

import PropTypes from 'prop-types';

const Container = styled.View`
  margin-right: 16px;
`;

export class Icon extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
  };

  render() {
    return (
      <Container>
        <FontAwesome {...this.props} />
      </Container>
    );
  }
}

export default Icon;
