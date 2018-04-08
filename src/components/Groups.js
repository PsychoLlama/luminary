import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import * as colors from '../constants/colors';
import * as actions from '../actions/groups';
import { selector } from '../utils/redux';
import Layout from './layout/Layout';
import Group from './Group';

const Container = styled.View`
  flex: 1;
`;

const EditButtonContainer = styled.View`
  margin-right: 16px;
`;

const EditLayout = styled.Text`
  color: ${colors.navbar.text};
  font-size: 18px;
`;

const SetupContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const SetupTitle = styled.Text`
  color: ${colors.text};
  font-size: 20;
`;

const SetupButtonContainer = styled.View`
  margin: 16px 0;
`;

export const SetupButton = styled.Button.attrs({
  color: colors.button.default,
})``;

const renderEmptySpace = R.always(null);

export class Groups extends Component {
  static propTypes = {
    fetchAllGroups: PropTypes.func.isRequired,
    layoutsDefined: PropTypes.bool.isRequired,
    serverUrl: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }),
  };

  static navigationOptions = props => ({
    title: 'Groups',
    headerRight: (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('AppSettings')}
      >
        <EditButtonContainer>
          <EditLayout>Settings</EditLayout>
        </EditButtonContainer>
      </TouchableOpacity>
    ),
  });

  state = { layout: null };

  componentDidMount() {
    this.props.fetchAllGroups(this.props.serverUrl);
  }

  render() {
    const { layoutsDefined } = this.props;

    const contents = layoutsDefined ? this.renderLayout() : this.renderSetup();

    return <Container onLayout={this.setDimensions}>{contents}</Container>;
  }

  renderLayout() {
    return (
      <Layout
        renderEmptySpace={renderEmptySpace}
        container={this.state.layout}
        renderReservedSpace={Group}
      />
    );
  }

  renderSetup() {
    return (
      <SetupContainer>
        <SetupTitle>You don&apos;t have any layouts.</SetupTitle>
        <SetupTitle>Create one?</SetupTitle>

        <SetupButtonContainer>
          <SetupButton title="Create layout" onPress={this.createLayout} />
        </SetupButtonContainer>
      </SetupContainer>
    );
  }

  createLayout = () => {
    this.props.navigation.navigate('LayoutManager');
  };

  setDimensions = event => {
    const { layout } = event.nativeEvent;
    this.setState({ layout });
  };
}

export const mapStateToProps = selector({
  layoutsDefined: R.pipe(R.path(['layout', 'reserved']), R.isEmpty, R.not),
  serverUrl: R.path(['server', 'url']),
});

const mapDispatchToProps = {
  fetchAllGroups: actions.fetchAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
