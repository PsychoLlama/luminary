const palette = {
  lightgray: '#B6C1CD',
  darkgray: '#11141A',
  yellow: '#FFBC42',
  green: '#218380',
  blue: '#2196F3',
  red: '#D90368',
};

export const error = palette.red;
export const text = palette.lightgray;
export const appBackground = palette.darkgray;

export const button = {
  default: palette.blue,
  error,
};

export const groups = {
  radio: palette.red,
  divider: '#15181F',
  bg: '#1B2129',
  selected: '#161C23',
};

groups.status = {
  off: groups.divider,
  on: palette.yellow,
};

export const layout = {
  option: {
    bg: groups.bg,
    selected: groups.selected,
    divider: groups.divider,
  },
};

layout.selection = {
  divider: layout.option.divider,
  invalidHighlight: palette.red,
  highlight: palette.blue,
  bg: layout.option.bg,
  text,
};

export const navbar = {
  text: '#AEB9C4',
  bg: '#101319',
};

export const settings = {
  icon: palette.green,
};
