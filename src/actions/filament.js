import { createAction } from 'redux-actions';
import { AsyncStorage } from 'react-native';

export const getServerUrl = createAction('GET_SERVER_URL', () => (
  AsyncStorage.getItem('filament_server_url')
));
