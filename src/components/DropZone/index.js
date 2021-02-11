import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { MdCloudUpload as CloudUploadIcon } from 'react-icons/md';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import { convertBytesToMbsOrKbs, createFileFromUrl } from './helpers/helpers';
import PreviewList from './PreviewList';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import styles from './dropzone-area-jss';

class DropzoneArea extends Component {
  state = {
    fileObjects: [],
    openSnackBar: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
    dropzoneText: ''
  };

  componentDidMount() {
    const { dropzoneText, initialFiles } = this.props;
    this.setState({ dropzoneText });
    this.filesArray(initialFiles);
  }

  onDrop = (files) => {
    const {
      filesLimit,
      getFileAddedMessage,
      getFileLimitExceedMessage,
      onChange,
      onDrop
    } = this.props;
    const { fileObjects } = this.state;
    const _this = this;
    if (filesLimit > 1 && fileObjects.length + files.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        snackbarMessage: getFileLimitExceedMessage(filesLimit),
        snackbarVariant: 'error'
      });
    } else {
      let count = 0;
      let message = '';
      if (!Array.isArray(files)) files = [files];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          _this.setState(
            {
              fileObjects:
                filesLimit <= 1
                  ? [{ file, data: event.target.result }]
                  : _this.state.fileObjects.concat({ file, data: event.target.result })
            },
            () => {
              if (onChange) {
                onChange(_this.state.fileObjects.map((fileObject) => fileObject.file));
              }
              if (onDrop) {
                onDrop(file);
              }
              message += getFileAddedMessage(file.name);
              count += 1; // we cannot rely on the index because this is asynchronous
              if (count === files.length) {
                // display message when the last one fires
                this.setState({
                  openSnackBar: true,
                  snackbarMessage: message,
                  snackbarVariant: 'success'
                });
              }
            }
          );
        };
        reader.readAsDataURL(file);
      });
    }
  };

  urlToFile = async (url, filename, mimeType) => {
    if (url.includes('undefined')) return '';

    let contentType = mimeType;
    contentType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
    return fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], filename, { type: contentType }));
  };

  filesArray = async (urls) => {
    const { fileObjects } = this.state;
    try {
      urls.forEach(async (url) => {
        if (url.includes('undefined')) return '';

        let file;
        const reader = new FileReader();

        if (url.match(/^data:([^;]+);/)) {
          file = await this.urlToFile(url);
        } else {
          file = await createFileFromUrl(url);
        }
        reader.onload = (event) => {
          this.setState({
            fileObjects: fileObjects.concat({ file, data: event.target.result })
          });
        };

        reader.readAsDataURL(file);
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleRemove = (fileIndex) => (event) => {
    event.stopPropagation();
    const { getFileRemovedMessage, onChange, onDelete } = this.props;
    const { fileObjects } = this.state;
    const { file } = fileObjects.filter((fileObject, i) => {
      return i === fileIndex;
    })[0];
    fileObjects.splice(fileIndex, 1);
    this.setState(fileObjects, () => {
      if (onDelete) {
        onDelete(file);
      }
      if (onChange) {
        onChange(fileObjects.map((fileObject) => fileObject.file));
      }
      this.setState({
        openSnackBar: true,
        snackbarMessage: getFileRemovedMessage(file.name),
        snackbarVariant: 'info'
      });
    });
  };

  handleDropRejected = (rejectedFiles, evt) => {
    const { acceptedFiles, getDropRejectMessage, maxFileSize, onDropRejected } = this.props;
    let message = '';
    rejectedFiles.forEach((rejectedFile) => {
      message = getDropRejectMessage(rejectedFile, acceptedFiles, maxFileSize);
    });
    if (onDropRejected) {
      onDropRejected(rejectedFiles, evt);
    }
    this.setState({
      openSnackBar: true,
      snackbarMessage: message,
      snackbarVariant: 'error'
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      openSnackBar: false
    });
  };

  render() {
    const {
      acceptedFiles,
      classes,
      dropzoneClass,
      dropzoneParagraphClass,
      filesLimit,
      maxFileSize,
      previewChipProps,
      showAlerts,
      showFileNames,
      showFileNamesInPreview,
      showPreviews,
      showPreviewsInDropzone,
      useChipsForPreview
    } = this.props;
    const {
      fileObjects,
      dropzoneText,
      openSnackBar,
      snackbarMessage,
      snackbarVariant
    } = this.state;
    const showPrevs = showPreviews && fileObjects.length > 0;
    const showPrevsInDropzone = showPreviewsInDropzone && fileObjects.length > 0;
    return (
      <>
        <Dropzone
          accept={acceptedFiles.join(',')}
          onDrop={this.onDrop}
          onDropRejected={this.handleDropRejected}
          className={clsx(dropzoneClass)}
          acceptClassName={classes.stripes}
          rejectClassName={classes.rejectStripes}
          maxSize={maxFileSize}
          multiple={filesLimit > 1}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className={classes.dropZone}>
              {filesLimit === 1 && fileObjects.length !== 1 && (
                <div>
                  <input {...getInputProps()} />
                  <div className={classes.dropzoneTextStyle}>
                    <CloudUploadIcon className={classes.uploadIconSize} {...getInputProps} />

                    <p className={clsx(classes.dropzoneParagraph, dropzoneParagraphClass)}>
                      {dropzoneText}
                    </p>
                  </div>
                </div>
              )}

              {showPrevsInDropzone && (
                <PreviewList
                  fileObjects={fileObjects}
                  handleRemove={this.handleRemove}
                  showFileNames={showFileNames}
                  useChipsForPreview={useChipsForPreview}
                  previewChipProps={previewChipProps}
                />
              )}
            </div>
          )}
        </Dropzone>

        {showPrevs && (
          <>
            <Grid container>
              <span>Preview:</span>
            </Grid>
            <PreviewList
              fileObjects={fileObjects}
              handleRemove={this.handleRemove}
              showFileNames={showFileNamesInPreview}
              useChipsForPreview={useChipsForPreview}
              previewChipProps={previewChipProps}
            />
          </>
        )}

        {showAlerts && (
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={this.handleCloseSnackbar}
          >
            <SnackbarContentWrapper
              onClose={this.handleCloseSnackbar}
              variant={snackbarVariant}
              message={snackbarMessage}
            />
          </Snackbar>
        )}
      </>
    );
  }
}

DropzoneArea.defaultProps = {
  acceptedFiles: ['image/*', 'video/*', 'application/*'],
  filesLimit: 3,
  maxFileSize: 3000000,
  dropzoneText: 'Drag and drop an image file here or click',
  showPreviews: false, // By default previews show up under in the dialog and inside in the standalone
  showPreviewsInDropzone: true,
  showFileNames: false,
  showFileNamesInPreview: false,
  previewChipProps: {},
  showAlerts: true,
  clearOnUnmount: true,
  initialFiles: [],
  getFileLimitExceedMessage: (filesLimit) =>
    `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
  getFileAddedMessage: (fileName) => `File ${fileName} successfully added.`,
  getFileRemovedMessage: (fileName) => `File ${fileName} removed.`,
  getDropRejectMessage: (rejectedFile, acceptedFiles, maxFileSize) => {
    let message = `File ${rejectedFile.name} was rejected. `;
    if (!acceptedFiles.includes(rejectedFile.type)) {
      message += 'File type not supported. ';
    }
    if (rejectedFile.size > maxFileSize) {
      message += 'File is too big. Size limit is ' + convertBytesToMbsOrKbs(maxFileSize) + '. ';
    }
    return message;
  },
  onChange: () => {},
  onDrop: () => {},
  onDropRejected: () => {},
  onDelete: () => {}
};

DropzoneArea.propTypes = {
  classes: PropTypes.object.isRequired,
  acceptedFiles: PropTypes.array,
  filesLimit: PropTypes.number,
  maxFileSize: PropTypes.number,
  dropzoneText: PropTypes.string,
  dropzoneClass: PropTypes.string,
  dropzoneParagraphClass: PropTypes.string,
  showPreviews: PropTypes.bool,
  showPreviewsInDropzone: PropTypes.bool,
  showFileNames: PropTypes.bool,
  showFileNamesInPreview: PropTypes.bool,
  useChipsForPreview: PropTypes.bool,
  previewChipProps: PropTypes.object,
  showAlerts: PropTypes.bool,
  clearOnUnmount: PropTypes.bool,
  initialFiles: PropTypes.arrayOf(PropTypes.string),
  getFileLimitExceedMessage: PropTypes.func,
  getFileAddedMessage: PropTypes.func,
  getFileRemovedMessage: PropTypes.func,
  getDropRejectMessage: PropTypes.func,
  onChange: PropTypes.func,
  onDrop: PropTypes.func,
  onDropRejected: PropTypes.func,
  onDelete: PropTypes.func
};

export default withStyles(styles)(DropzoneArea);
