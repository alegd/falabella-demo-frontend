import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createLegalForm, updateLegalForm } from 'redux/actions';
import { FormDialog, TextInput } from 'components';
import { withTranslation } from '../../../i18n';

const SectorsForm = ({ open, handleClose, onCreateLegalForm, onUpdateLegalForm, legalForm, t }) => {
  const { id } = legalForm.toJS();
  const isNewLegalForm = !id;

  const initialValues = {
    name: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field-required', { field: t('name') }))
  });

  const onSubmit = async (fields, { setStatus }) => {
    setStatus();
    if (isNewLegalForm) {
      await onCreateLegalForm(fields);
    } else {
      await onUpdateLegalForm({ id, ...fields });
    }
    handleClose();
  };

  return (
    <FormDialog
      title={`${isNewLegalForm ? t('new') : t('update')} ${t('legal-forms', {
        amount: 1
      }).toLowerCase()}`}
      open={open}
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ setFieldValue }) => {
          useEffect(() => {
            if (!isNewLegalForm) {
              Object.keys(initialValues).forEach((field) => {
                setFieldValue(field, legalForm.toJS()[field], false);
              });
            }
          }, []);

          return (
            <Form className="flex flex-col w-72">
              <TextInput name="name" label={t('name')} type="text" required />

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

SectorsForm.defaultProps = {
  legalForm: {}
};

SectorsForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onCreateLegalForm: PropTypes.func.isRequired,
  onUpdateLegalForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  legalForm: PropTypes.object,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.getIn(['legalForm', 'loading']),
  legalForm: state.getIn(['legalForm', 'legalForm'])
});

const mapDispatchToProps = (dispatch) => ({
  onCreateLegalForm: (legalForm) => dispatch(createLegalForm(legalForm)),
  onUpdateLegalForm: (legalForm) => dispatch(updateLegalForm(legalForm))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(SectorsForm));
