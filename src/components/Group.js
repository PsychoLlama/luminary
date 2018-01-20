import { TouchableWithoutFeedback, Vibration } from 'react-native';
import styled from 'styled-components/native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import * as colors from '../constants/colors';
import * as actions from '../actions/groups';
import { selector } from '../utils/redux';

export const Container = styled.View`
  border-color: ${colors.groups.divider};
  background-color: ${colors.groups.bg};
  justify-content: center;
  align-items: center;
  position: absolute;
  border-width: 0.5px;

  ${props =>
    props.on &&
    `
    border-bottom-color: ${colors.groups.status.on};
    border-bottom-width: 2px;
    padding-top: 1.5px;
  `};
`;

export const Title = styled.Text`
  color: ${colors.text};
  font-size: 20px;
  padding: 2px;

  ${props => props.small && 'font-size: 12px'};
`;

const extractLayout = R.pick(['top', 'left', 'width', 'height']);
export class Group extends Component {
  static propTypes = {
    toggleLights: PropTypes.func.isRequired,
    blockWidth: PropTypes.number.isRequired,
    serverUrl: PropTypes.string.isRequired,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      anyOn: PropTypes.bool,
    }),
  };

  render() {
    const { group, blockWidth } = this.props;
    const constrainWidth = blockWidth === 1;
    const position = extractLayout(this.props);
    const on = R.propOr(false, 'anyOn', group);

    return (
      <TouchableWithoutFeedback
        onPressIn={this.provideFeedback}
        onPress={this.toggleLights}
      >
        <Container on={on} style={position}>
          <Title small={constrainWidth}>{R.prop('name', group)}</Title>
        </Container>
      </TouchableWithoutFeedback>
    );
  }

  provideFeedback = () => Vibration.vibrate(10);

  toggleLights = () => {
    const { serverUrl, group } = this.props;

    this.props.toggleLights(serverUrl, {
      on: !group.anyOn,
      id: group.id,
    });
  };
}

const withLayout = fn => (state, props) =>
  R.pipe(R.path(['layout', 'reserved', props.id]), fn)(state);

export const mapStateToProps = selector({
  blockWidth: withLayout(R.prop('width')),
  serverUrl: R.path(['server', 'url']),
  group: (state, props) => {
    const groupId = withLayout(R.prop('group'))(state, props);

    return R.path(['groups', groupId], state);
  },
});

const mapDispatchToProps = {
  toggleLights: actions.toggleLights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
