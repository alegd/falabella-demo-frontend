import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createScope, updateScope } from 'redux/actions';
import { FormDialog, TextInput } from 'components';
import { i18n, withTranslation } from '../../../i18n';

const SectorsForm = ({ open, handleClose, onCreateScope, onUpdateScope, scope, t }) => {
  const { id } = scope.toJS();
  const isNewScope = !id;
  const [nameObj, setNameObj] = useState();

  const initialValues = {
    name: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field-required', { field: t('name') }))
  });

  const onSubmit = async (fields, { setStatus }) => {
    setStatus();
    const i18nFields = fields;
    nameObj[i18n.language] = fields.name;
    i18nFields.name = JSON.stringify(nameObj);
    if (isNewScope) {
      await onCreateScope(i18nFields);
    } else {
      await onUpdateScope({ id, ...i18nFields });
    }
    handleClose();
  };

  return (
    <FormDialog
      title={`${isNewScope ? t('new') : t('update')} ${t('scopes', { amount: 1 }).toLowerCase()}`}
      open={open}
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ setFieldValue }) => {
          useEffect(() => {
            if (!isNewScope) {
              Object.keys(initialValues).forEach((field) => {
                if (field === 'name') {
                  const value = scope.toJS()[field];
                  setNameObj(
                    JSON.parse(value.includes('{') ? value : `{"${i18n.language}":"${value}"}`)
                  );
                  setFieldValue(
                    field,
                    value.includes('{') ? JSON.parse(value)[i18n.language] : value,
                    false
                  );
                } else {
                  setFieldValue(field, scope.toJS()[field], false);
                }
              });
            }
          }, []);

          return (
            <Form className="flex flex-col w-72">
              <TextInput name="name" label={t('name')} type="text" required />

              <div className="mt-2 mb-4">
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
  scope: {}
};

SectorsForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onCreateScope: PropTypes.func.isRequired,
  onUpdateScope: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  scope: PropTypes.object,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.getIn(['scope', 'loading']),
  scope: state.getIn(['scope', 'scope'])
});

const mapDispatchToProps = (dispatch) => ({
  onCreateScope: (scope) => dispatch(createScope(scope)),
  onUpdateScope: (scope) => dispatch(updateScope(scope))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(SectorsForm));
