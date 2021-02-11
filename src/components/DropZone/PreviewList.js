import Chip from '@material-ui/core/Chip';
import { Grid, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  MdAttachFile as AttachFileIcon,
  MdDelete as DeleteIcon,
  MdUpdate as UpdateIcon
} from 'react-icons/md';
import React from 'react';
import PropTypes from 'prop-types';
import { isImage } from './helpers/helpers.js';

const styles = {
  removeBtn: {
    display: 'flex',
    transition: '.5s ease',
    position: 'absolute',
    opacity: 0,
    top: 'calc(50% - 24px)',
    left: 'calc(50% - 48px)'
  },
  smallPreviewImg: {
    width: 'initial',
    maxWidth: '100%',
    // marginTop: 5,
    marginRight: 10,
    color: 'rgba(0, 0, 0, 0.87)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    borderRadius: 2,
    zIndex: 5,
    opacity: 1
  },
  imageContainer: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    '&:hover $smallPreviewImg': {
      opacity: 0.25
    },
    '&:hover $removeBtn': {
      opacity: 1
    }
  }
};

const PreviewList = (props) => {
  const {
    fileObjects,
    handleRemove,
    showFileNames,
    useChipsForPreview,
    previewChipProps,
    classes
  } = props;
  if (useChipsForPreview) {
    return fileObjects.map((fileObject, i) => {
      return (
        <div key={i}>
          <Chip
            label={fileObject.file.name}
            onDelete={handleRemove(i)}
            variant="outlined"
            {...previewChipProps}
          />
        </div>
      );
    });
  }
  return (
    <Grid container justify="center" alignItems="center">
      {fileObjects.map((fileObject, i) => {
        const img = isImage(fileObject.file) ? (
          <img
            alt="presentation"
            className={`${classes.smallPreviewImg} h-56`}
            role="presentation"
            src={fileObject.data}
          />
        ) : (
          <AttachFileIcon className={classes.smallPreviewImg} />
        );
        return (
          <Grid item key={i} className={classes.imageContainer}>
            {img}

            <div className={classes.removeBtn}>
              <IconButton
                //   onClick={handleRemove(i)}
                aria-label="Update"
              >
                <UpdateIcon />
              </IconButton>

              <IconButton onClick={handleRemove(i)} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </div>

            {showFileNames && <p>{fileObject.file.name}</p>}
          </Grid>
        );
      })}
    </Grid>
  );
};

PreviewList.propTypes = {
  classes: PropTypes.object.isRequired,
  fileObjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleRemove: PropTypes.func.isRequired,
  showFileNames: PropTypes.bool,
  useChipsForPreview: PropTypes.bool,
  previewChipProps: PropTypes.object
};

export default withStyles(styles)(PreviewList);
