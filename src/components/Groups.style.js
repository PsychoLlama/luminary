import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },

  loading: {
    textAlign: 'center',
    color: '#B6C1CD',
    width: '100%',
    fontSize: 25,
  },

  error: {
    textAlign: 'center',
    width: '100%',
    color: '#F14981',
    fontSize: 25,
    padding: 10,
  },
});
