import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createSubSector, updateSubSector } from 'redux/actions';
import { FormDialog, SelectInput, TextInput } from 'components';
import { i18n, withTranslation } from '../../../i18n';

const SubSectorsForm = ({
  sectors,
  handleClose,
  onCreateSubSector,
  onUpdateSubSector,
  open,
  subSector,
  t
}) => {
  const { id } = subSector.toJS();
  const isNewSubSector = !id;
  const [nameObj, setNameObj] = useState();

  const initialValues = {
    name: '',
    sector: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field-required', { field: t('name') })),
    sector: Yup.object().required('El sector es requerido')
  });

  const onSubmit = async (fields, { setStatus }) => {
    setStatus();
    const i18nFields = fields;
    nameObj[i18n.language] = fields.name;
    i18nFields.name = JSON.stringify(nameObj);
    if (isNewSubSector) {
      await onCreateSubSector(i18nFields);
    } else {
      await onUpdateSubSector({ id, ...i18nFields });
    }
    handleClose();
  };

  return (
    <FormDialog
      title={`${isNewSubSector ? t('new') : t('update')} ${t('sub-sectors', {
        amount: 1
      }).toLowerCase()}`}
      open={open}
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ setFieldValue }) => {
          useEffect(() => {
            if (!isNewSubSector) {
              Object.keys(initialValues).forEach((field) => {
                if (field === 'name') {
                  const value = subSector.toJS()[field];
                  setNameObj(
                    JSON.parse(value.includes('{') ? value : `{"${i18n.language}":"${value}"}`)
                  );
                  setFieldValue(
                    field,
                    value.includes('{') ? JSON.parse(value)[i18n.language] : value,
                    false
                  );
                } else {
                  setFieldValue(field, subSector.toJS()[field], false);
                }
              });
            }
          }, []);

          return (
            <Form className="flex flex-col w-72">
              <TextInput name="name" label={t('name')} type="text" required />

              <SelectInput
                name="sector"
                label={t('sectors', { amount: 1 })}
                options={sectors.toJS()}
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

SubSectorsForm.defaultProps = {
  subSector: {}
};

SubSectorsForm.propTypes = {
  sectors: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  onCreateSubSector: PropTypes.func.isRequired,
  onUpdateSubSector: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  subSector: PropTypes.object,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.getIn(['subSector', 'loading']),
  sectors: state.getIn(['sector', 'sectors']),
  subSector: state.getIn(['subSector', 'subSector'])
});

const mapDispatchToProps = (dispatch) => ({
  onCreateSubSector: (subSector) => dispatch(createSubSector(subSector)),
  onUpdateSubSector: (subSector) => dispatch(updateSubSector(subSector))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('common')(SubSectorsForm));
