import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createValueChain, updateValueChain } from 'redux/actions';
import { FormDialog, TextInput } from 'components';
import { withTranslation } from '../../../i18n';

const ValueChainForm = ({
  open,
  handleClose,
  onCreateValueChain,
  onUpdateValueChain,
  valueChain,
  t
}) => {
  const { id } = valueChain.toJS();
  const isNewValueChain = !id;

  const initialValues = {
    name: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field-required', { field: t('name') }))
  });

  const onSubmit = async (fields, { setStatus }) => {
    setStatus();
    if (isNewValueChain) {
      await onCreateValueChain(fields);
    } else {
      await onUpdateValueChain({ id, ...fields });
    }
    handleClose();
  };

  return (
    <FormDialog
      title={`${isNewValueChain ? t('new') : t('update')} ${t('value-chains', {
        amount: 1
      }).toLowerCase()}`}
      open={open}
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ setFieldValue }) => {
          useEffect(() => {
            if (!isNewValueChain) {
              Object.keys(initialValues).forEach((field) => {
                setFieldValue(field, valueChain.toJS()[field], false);
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

ValueChainForm.defaultProps = {
  valueChain: {}
};

ValueChainForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onCreateValueChain: PropTypes.func.isRequired,
  onUpdateValueChain: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  valueChain: PropTypes.object,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.getIn(['valueChain', 'loading']),
  valueChain: state.getIn(['valueChain', 'valueChain'])
});

const mapDispatchToProps = (dispatch) => ({
  onCreateValueChain: (valueChain) => dispatch(createValueChain(valueChain)),
  onUpdateValueChain: (valueChain) => dispatch(updateValueChain(valueChain))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('common')(ValueChainForm));
