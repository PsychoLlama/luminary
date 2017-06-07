import { graphql, gql } from 'react-apollo';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';

import styles from './Group.style';

export class Group extends Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    divide: PropTypes.bool,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      state: PropTypes.shape({
        anyOn: PropTypes.bool,
      }).isRequired,
    }).isRequired,
  }

  render() {
    const { group, divide } = this.props;
    const online = group.state.anyOn ? styles.on : styles.off;
    const style = [styles.title];

    if (divide) {
      style.push(styles.divide);
    }

    return (
      <TouchableWithoutFeedback onPress={this.toggleLights}>
        <View style={styles.container}>
          <Text style={style}>
            {this.props.group.name}
          </Text>

          <View style={[styles.status, online]} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  toggleLights = () => {
    const { group, mutate } = this.props;
    const toggledState = !group.state.anyOn;

    mutate({
      variables: {
        id: group.id,
        on: toggledState,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        group: {
          __typename: 'Group',
          id: group.id,
          state: {
            __typename: 'GroupState',
            anyOn: toggledState,
          },
        },
      },
    });
  }
}

const mutation = gql`
mutation ToggleGroupLights($id: ID!, $on: Boolean!) {
  group(id: $id, on: $on) { id state { anyOn } }
}
`;

export default graphql(mutation)(Group);
