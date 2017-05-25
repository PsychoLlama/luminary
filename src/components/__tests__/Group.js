import { shallow } from 'enzyme';
import React from 'react';

import { Group } from '../Group';

import styles from '../Group.style';

describe('<Group>', () => {
  let props;
  const setup = () => shallow(<Group {...props} />);

  beforeEach(() => {
    props = {
      mutate: jest.fn(),
      divide: false,
      group: {
        name: 'Hall',
        id: 3,
        state: {
          anyOn: true,
        },
      },
    };
  });

  it('shows the group name', () => {
    const name = setup().find('Text').prop('children');

    expect(name).toContain(props.group.name);
  });

  it('shows when the group is online', () => {
    const status = setup().find({ style: [styles.status, styles.on] });

    expect(status.length).toBe(1);
  });

  it('shows when the group is offline', () => {
    props.group.state.anyOn = false;
    const status = setup().find({ style: [styles.status, styles.off] });

    expect(status.length).toBe(1);
  });

  it('shows the divider if set', () => {
    props.divide = true;
    const group = setup().find({ style: [styles.title, styles.divide] });

    expect(group.length).toBe(1);
  });

  it('does not show the divider if not set', () => {
    props.divide = false;
    const group = setup().find({ style: [styles.title, styles.divide] });

    expect(group.length).toBe(0);
  });

  it('toggles the group when tapped', () => {
    setup().simulate('press');

    expect(props.mutate).toHaveBeenCalledWith({
      variables: {
        id: props.group.id,
        on: !props.group.state.anyOn,
      },
    });
  });
});
