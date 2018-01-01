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
      id: PropTypes.string.isRequired,
      anyOn: PropTypes.bool,
    }).isRequired,
  }

  render() {
    const { group, divide } = this.props;
    const online = group.anyOn ? styles.on : styles.off;
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
    const toggledState = !group.anyOn;

    mutate({
      variables: {
        id: group.id,
        on: toggledState,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        setGroupState: {
          __typename: 'Group',
          id: group.id,
          anyOn: toggledState,
        },
      },
    });
  }
}

const mutation = gql`
mutation ToggleGroupLights($id: ID!, $on: Boolean!) {
  setGroupState(id: $id, state: { on: $on }) { id anyOn }
}
`;

export default graphql(mutation)(Group);
