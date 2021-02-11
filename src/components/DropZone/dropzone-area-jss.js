const styles = {
  '@keyframes progress': {
    '0%': {
      backgroundPosition: '0 0'
    },
    '100%': {
      backgroundPosition: '-70px 0'
    }
  },
  dropZone: {
    position: 'relative',
    width: '100%',
    minHeight: '250px',
    backgroundColor: '#F0F0F0',
    border: 'dashed',
    borderColor: '#C8C8C8',
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: ' center'
  },
  stripes: {
    border: 'solid',
    backgroundImage:
      'repeating-linear-gradient(-45deg, #F0F0F0, #F0F0F0 25px, #C8C8C8 25px, #C8C8C8 50px)',
    animation: 'progress 2s linear infinite !important',
    backgroundSize: '150% 100%'
  },
  rejectStripes: {
    border: 'solid',
    backgroundImage:
      'repeating-linear-gradient(-45deg, #fc8785, #fc8785 25px, #f4231f 25px, #f4231f 50px)',
    animation: 'progress 2s linear infinite !important',
    backgroundSize: '150% 100%'
  },
  dropzoneTextStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  uploadIconSize: {
    width: 40,
    height: 40,
    color: '#c8c8c8'
  },
  dropzoneParagraph: {
    fontSize: 16
  }
};

export default styles;
