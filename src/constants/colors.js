const palette = {
  lightgray: '#B6C1CD',
  darkgray: '#11141A',
  yellow: '#FFBC42',
  blue: '#2A8EC0',
  red: '#D90368',
};

export const error = palette.red;
export const text = palette.lightgray;
export const appBackground = palette.darkgray;

export const groups = {
  divider: '#15181F',
  bg: '#1B2129',
  selected: '#161C23',
};

groups.status = {
  off: groups.divider,
  on: palette.yellow,
};
