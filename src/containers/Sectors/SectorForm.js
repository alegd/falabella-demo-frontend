import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createSector, updateSector } from 'redux/actions';
import { FormDialog, SelectInput, TextInput } from 'components';
import { i18n, withTranslation } from '../../../i18n';

const SectorForm = ({ scopes, handleClose, onCreateSector, onUpdateSector, open, sector, t }) => {
  const { id } = sector.toJS();
  const isNewSector = !id;
  const [nameObj, setNameObj] = useState();

  const initialValues = {
    name: '',
    scope: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field-required', { field: t('name') })),
    scope: Yup.object().required(t('field-required', { field: t('scopes', { amount: 1 }) }))
  });

  const onSubmit = async (fields, { setStatus }) => {
    setStatus();
    const i18nFields = fields;
    nameObj[i18n.language] = fields.name;
    i18nFields.name = JSON.stringify(nameObj);
    if (isNewSector) {
      await onCreateSector(i18nFields);
    } else {
      await onUpdateSector({ id, ...i18nFields });
    }
    handleClose();
  };

  return (
    <FormDialog
      title={`${isNewSector ? t('new') : t('update')} ${t('sectors', { amount: 1 }).toLowerCase()}`}
      open={open}
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ setFieldValue }) => {
          useEffect(() => {
            if (!isNewSector) {
              Object.keys(initialValues).forEach((field) => {
                if (field === 'name') {
                  const value = sector.toJS()[field];
                  setNameObj(
                    JSON.parse(value.includes('{') ? value : `{"${i18n.language}":"${value}"}`)
                  );
                  setFieldValue(
                    field,
                    value.includes('{') ? JSON.parse(value)[i18n.language] : value,
                    false
                  );
                } else {
                  setFieldValue(field, sector.toJS()[field], false);
                }
              });
            }
          }, []);

          return (
            <Form className="flex flex-col w-72">
              <TextInput name="name" label={t('name')} type="text" required />

              <SelectInput
                name="scope"
                label={t('scopes', { amount: 1 })}
                options={scopes.toJS()}
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

SectorForm.defaultProps = {
  sector: {}
};

SectorForm.propTypes = {
  scopes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  onCreateSector: PropTypes.func.isRequired,
  onUpdateSector: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  sector: PropTypes.object,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.getIn(['sector', 'loading']),
  scopes: state.getIn(['scope', 'scopes']),
  sector: state.getIn(['sector', 'sector'])
});

const mapDispatchToProps = (dispatch) => ({
  onCreateSector: (sector) => dispatch(createSector(sector)),
  onUpdateSector: (sector) => dispatch(updateSector(sector))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(SectorForm));
