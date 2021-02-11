import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createActivity, getAllSubSectors, updateActivity } from 'redux/actions';
import { FormDialog, TextInput, SelectInput } from 'components';
import { i18n, withTranslation } from '../../../i18n';

const ActivityForm = ({
  open,
  handleClose,
  onCreateActivity,
  onUpdateActivity,
  onGetSubSectors,
  activity,
  subSectors,
  t
}) => {
  const { id } = activity.toJS();
  const isNewActivity = !id;
  const [nameObj, setNameObj] = useState();

  const initialValues = {
    name: '',
    subSector: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field-required', { field: t('name') })),
    subSector: Yup.object().required('El sub-sector es requerido')
  });

  const handleSubmit = async (fields, { setStatus }) => {
    setStatus();
    const i18nFields = fields;
    nameObj[i18n.language] = fields.name;
    i18nFields.name = JSON.stringify(nameObj);
    if (isNewActivity) {
      await onCreateActivity(i18nFields);
    } else {
      await onUpdateActivity({ id, ...i18nFields });
    }
    handleClose();
  };

  return (
    <FormDialog
      title={`${isNewActivity ? t('new') : t('update')} ${t('activities', {
        amount: 1
      }).toLowerCase()}`}
      open={open}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => {
          useEffect(() => {
            if (typeof activity === 'string') {
              setFieldValue('name', activity);
            } else if (!isNewActivity) {
              Object.keys(initialValues).forEach((field) => {
                if (field === 'name') {
                  const value = activity.toJS()[field];
                  setNameObj(
                    JSON.parse(value.includes('{') ? value : `{"${i18n.language}":"${value}"}`)
                  );
                  setFieldValue(
                    field,
                    value.includes('{') ? JSON.parse(value)[i18n.language] : value,
                    false
                  );
                } else {
                  setFieldValue(field, activity.toJS()[field], false);
                }
              });

              onGetSubSectors({ size: 150 });
            }
          }, []);

          return (
            <Form className="flex flex-col w-72">
              <TextInput name="name" label={t('name')} type="text" required />

              <SelectInput
                name="subSector"
                label={t('sub-sectors', { amount: 1 })}
                options={subSectors.toJS()}
                required
              />

              <div className="my-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="py-2 px-4 border border-gray-300 rounded-sm text-sm leading-5 font-medium text-gray-700 uppercase hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-300 ease-in-out"
                    onClick={() => handleClose()}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex ml-4 py-2 justify-center rounded-sm px-4 bg-blue-600 text-sm leading-5 font-medium text-white uppercase hover:bg-blue-800 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-300"
                  >
                    {t('save')}
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </FormDialog>
  );
};

ActivityForm.defaultProps = {
  activity: {}
};

ActivityForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  //   loading: PropTypes.bool.isRequired,
  onGetSubSectors: PropTypes.func.isRequired,
  onCreateActivity: PropTypes.func.isRequired,
  onUpdateActivity: PropTypes.func.isRequired,
  activity: PropTypes.object,
  subSectors: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.getIn(['activity', 'loading']),
  activity: state.getIn(['activity', 'activity']),
  subSectors: state.getIn(['subSector', 'subSectors'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetSubSectors: (query) => dispatch(getAllSubSectors(query)),
  onCreateActivity: (activity) => dispatch(createActivity(activity)),
  onUpdateActivity: (activity) => dispatch(updateActivity(activity))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('common')(ActivityForm));
