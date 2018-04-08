import styled from 'styled-components/native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import R from 'ramda';

import * as colors from '../../constants/colors';

const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.View`
  background-color: ${colors.layout.selection.bg};
  border: 1px solid ${colors.layout.selection.divider};
  position: absolute;
`;

const Highlight = styled.View`
  border: 0.5px solid ${colors.layout.selection.highlight};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: ${colors.layout.selection.text};

  ${props => props.small && 'font-size: 12px'};
`;

export class Selection extends React.Component {
  static propTypes = {
    blockWidth: PropTypes.number.isRequired,
    groupTitle: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    onLayout: PropTypes.func,
  };

  render() {
    const inline = R.pick(['height', 'width', 'left', 'top'], this.props);
    const { groupTitle, blockWidth } = this.props;
    const useSmallTitle = blockWidth === 1;

    return (
      <Container style={inline} onLayout={this.props.onLayout}>
        <Highlight>
          <Touchable>
            <Title small={useSmallTitle}>{groupTitle}</Title>
          </Touchable>
        </Highlight>
      </Container>
    );
  }
}

export const mapStateToProps = (state, props) => {
  const layout = R.path(['layout', 'reserved', props.id], state);
  const groupId = R.prop('group', layout);

  return {
    groupTitle: R.path(['groups', groupId, 'name'], state),
    blockWidth: R.prop('width', layout),
  };
};

export default connect(mapStateToProps)(Selection);
