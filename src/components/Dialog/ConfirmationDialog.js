import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { withTranslation } from '../../../i18n';

const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmButtonLabel,
  handleCancel,
  handleConfirm,
  t
}) => (
  <Dialog
    open={open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <button
        type="button"
        className="py-2 px-4 border border-gray-300 rounded-sm text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
        onClick={handleCancel}
      >
        {t('cancel')}
      </button>
      <button
        type="button"
        className="inline-flex ml-4 py-2 justify-center rounded-sm px-4 bg-red-600 text-sm leading-5 font-medium text-white hover:bg-red-700 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
        onClick={handleConfirm}
      >
        {confirmButtonLabel}
      </button>
    </DialogActions>
  </Dialog>
);

ConfirmationDialog.defaultProps = {
  confirmButtonLabel: 'Confirmar',
  message: 'Seguro que deseas continuar con esta acción?',
  title: 'Alert'
};

ConfirmationDialog.propTypes = {
  confirmButtonLabel: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(ConfirmationDialog);
