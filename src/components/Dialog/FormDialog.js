import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({ root: { overflow: 'visible' } });

const FormDialog = ({ classes, open, title, children }) => (
  <Dialog
    classes={{ paperScrollPaper: classes.root }}
    scroll="paper"
    open={open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent className={classes.root}>{children}</DialogContent>
  </Dialog>
);

FormDialog.defaultProps = {
  title: 'Alert'
};

FormDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string
};

export default withStyles(styles)(FormDialog);
