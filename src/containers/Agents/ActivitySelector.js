import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { AutocompleteSelector } from 'components';
import { getScopes, getSectors, getSubSectors, getActivities } from 'redux/actions';
import ActivityForm from 'containers/Activities/ActivityForm';
import styles from './selector-jss';
import { withTranslation } from '../../../i18n';

const ActivitySelector = ({
  activities,
  classes,
  onAddTag,
  onGetScopes,
  onGetSectors,
  onGetSubSectors,
  onGetActivities,
  onTagChange,
  scopes,
  sectors,
  subSectors,
  t
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [scope, setScope] = useState(null);
  const [sector, setSector] = useState(null);
  const [subSector, setSubSector] = useState(null);
  const [activity, setActivity] = useState(null);
  const [tag, setTag] = useState([]);

  useEffect(() => {
    onGetScopes({ size: 150 });
  }, []);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleChange = (tags, newValue) => {
    if (tags.filter((val) => val.type === newValue.type).length === 0) {
      const result = [...tags, newValue];
      onTagChange(result);
      return result;
    }

    return tags;
  };

  const handleScopeSelection = (event, value) => {
    const newValue = value;
    newValue.type = 'scope';
    if (newValue && newValue.inputValue) {
      setScope(newValue);
      handleOpenForm();
    }

    if (typeof newValue === 'string') {
      setScope(newValue);
      return;
    }

    setScope(newValue, onGetSectors({ scopeId: newValue.id }));
    setTag((tags) => handleChange(tags, newValue));
  };

  const handleSectorSelection = (event, value) => {
    const newValue = value;
    if (newValue) {
      newValue.type = 'sector';
      if (newValue.inputValue) {
        setSector(newValue);
        handleOpenForm();
      }

      if (typeof newValue === 'string') {
        setSector(newValue);
        return;
      }

      setSector(newValue, onGetSubSectors({ sectorId: newValue.id }));
      setTag((tags) => handleChange(tags, newValue));
    }
  };

  const handleSubSectorSelection = (event, value) => {
    const newValue = value;
    if (newValue) {
      newValue.type = 'sub-sector';
      if (newValue.inputValue) {
        setSubSector(newValue);
        handleOpenForm();
      }

      if (typeof newValue === 'string') {
        setSubSector(newValue);
        return;
      }

      setSubSector(newValue, onGetActivities({ subSectorId: newValue.id }));
      setTag((tags) => handleChange(tags, newValue));
    }
  };

  const handleActivitySelection = (event, value) => {
    const newValue = value;
    if (newValue) {
      newValue.type = 'activity';
      if (newValue.inputValue) {
        setActivity(newValue);
        handleOpenForm();
      }

      if (typeof newValue === 'string') {
        setActivity(newValue);
        return;
      }

      setActivity(newValue);
      setTag((tags) => handleChange(tags, newValue));
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <AutocompleteSelector
        freeSolo
        className={clsx(classes.root, 'capitalize')}
        options={scopes.toJS()}
        handleSelection={(event, newVal) => handleScopeSelection(event, newVal)}
        value={scope}
        label={t('scopes', { amount: 1 })}
      />

      <AutocompleteSelector
        freeSolo
        className={clsx(classes.root, 'capitalize')}
        options={sectors.toJS()}
        handleSelection={(event, newVal) => handleSectorSelection(event, newVal)}
        value={sector}
        label={t('sectors', { amount: 1 })}
      />

      <AutocompleteSelector
        freeSolo
        className={clsx(classes.root, 'capitalize')}
        options={subSectors.toJS()}
        handleSelection={(event, newVal) => handleSubSectorSelection(event, newVal)}
        value={subSector}
        label={t('sub-sectors', { amount: 1 })}
      />

      <AutocompleteSelector
        freeSolo
        className={clsx(classes.root, 'capitalize')}
        options={activities.toJS()}
        handleSelection={(event, newVal) => handleActivitySelection(event, newVal)}
        value={activity}
        label={t('activities', { amount: 1 })}
      />

      <button
        className="w-full px-4 py-3 bg-primary-main font-medium rounded-md tracking-wide border border-gray-200 cursor-pointer hover:bg-white hover:text-primary text-white"
        type="button"
        onClick={() => {
          onAddTag();
          setTag([]);
          setScope(null);
          setSector(null);
          onGetSectors({ scopeId: 0 });
          setSubSector(null);
          onGetSubSectors({ sectorId: 0 });
          setActivity(null);
          onGetActivities({ subSectorId: 0 });
        }}
      >
        {t('add')}
      </button>

      <Dialog open={openForm} onClose={handleCloseForm} aria-labelledby="form-dialog">
        <DialogTitle id="form-dialog">{t('new')}</DialogTitle>
        <DialogContent>
          <ActivityForm activity={tag} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleCloseForm} color="primary">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ActivitySelector.defaultProps = {
  value: null
};

ActivitySelector.propTypes = {
  activities: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  scopes: PropTypes.object.isRequired,
  sectors: PropTypes.object.isRequired,
  subSectors: PropTypes.object.isRequired,
  onAddTag: PropTypes.func.isRequired,
  onGetActivities: PropTypes.func.isRequired,
  onGetScopes: PropTypes.func.isRequired,
  onGetSectors: PropTypes.func.isRequired,
  onGetSubSectors: PropTypes.func.isRequired,
  onTagChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const activityReducer = 'activity';
const scopeReducer = 'scope';
const sectorReducer = 'sector';
const subSectorReducer = 'subSector';

const mapStateToProps = (state) => ({
  activities: state.getIn([activityReducer, 'activities']),
  scopes: state.getIn([scopeReducer, 'scopes']),
  sectors: state.getIn([sectorReducer, 'sectors']),
  subSectors: state.getIn([subSectorReducer, 'subSectors'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetScopes: () => dispatch(getScopes()),
  onGetSectors: (scope) => dispatch(getSectors(scope)),
  onGetSubSectors: (sector) => dispatch(getSubSectors(sector)),
  onGetActivities: (subSector) => dispatch(getActivities(subSector))
});

const ActivitySelectorMapped = withStyles(styles)(ActivitySelector);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('common')(ActivitySelectorMapped));
