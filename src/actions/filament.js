import { AsyncStorage } from 'react-native';

import { optimistic } from '../utils/actions';

export const getServerUrl = optimistic('GET_SERVER_URL', () => (
  AsyncStorage.getItem('filament_server_url')
));
