module.exports = {
  corePlugins: { outline: false },
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem'
      },
      backgroundSize: {
        full: '100$'
      },
      textColor: {
        primary: '#6c9a28',
        secondary: '#ffed4a',
        danger: '#e3342f'
      },
      backgroundColor: {
        primary: { light: '#e7ffc4', main: '#6c9a28' },
        secondary: '#ffed4a',
        danger: '#e3342f'
      },
      borderColor: {
        primary: '#6c9a28',
        secondary: '#ffed4a',
        danger: '#e3342f'
      }
    }
  },
  variants: {},
  plugins: []
};
