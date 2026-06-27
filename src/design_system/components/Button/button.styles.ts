import getColor from '../../utils/getColor'

export const buttonStyles = {
  primary: {
    filled: {
      bg: getColor('primary', 500),
      color: '#fff',
      hover: getColor('primary', 600),
      active: getColor('primary', 700),
    },
    outline: {
      border: getColor('primary', 500),
      color: getColor('primary', 500),
      hoverBg: getColor('primary', 50),
    },
    ghost: {
      color: getColor('primary', 500),
      hoverBg: getColor('primary', 50),
    },
    soft: {
      bg: getColor('primary', 100),
      color: getColor('primary', 700),
    },
  },

  danger: {
    filled: {
      bg: getColor('red', 500),
      color: '#fff',
      hover: getColor('red', 600),
      active: getColor('red', 700),
    },
    outline: {
      border: getColor('red', 500),
      color: getColor('red', 500),
      hoverBg: getColor('red', 50),
    },
    ghost: {
      color: getColor('red', 500),
      hoverBg: getColor('red', 50),
    },
    soft: {
      bg: getColor('red', 100),
      color: getColor('red', 700),
    },
  },

  success: {
    filled: {
      bg: getColor('green', 500),
      color: '#fff',
      hover: getColor('green', 600),
      active: getColor('green', 700),
    },
  },
}
