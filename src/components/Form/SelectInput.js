/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Field } from 'formik';
import { i18n, withTranslation } from '../../../i18n';

const SelectInput = ({ isMulti, label, options, name, t, ...props }) => {
  const { id, onChange, required } = props;

  if (options.length > 0) {
    options.unshift({ name: t('none') });
  }

  return (
    <Field name={name} id={name}>
      {({ field: { value }, form: { setFieldValue }, meta: { error } }) => (
        <>
          {label && (
            <label
              className={`block capitalize text-sm my-1 font-medium leading-5 w-1/3 ${
                error ? 'text-red-500' : 'text-gray-700'
              }`}
              htmlFor={id || name}
            >
              {`${label} `}
              {required ? <span className="text-gray-500">*</span> : null}
            </label>
          )}
          <div className="flex flex-col flex-1">
            <Select
              className={`flex-1 sm:text-sm sm:leading-5 w-full ${
                error ? 'border-red-500' : 'border-gray-400'
              } rounded-md`}
              placeholder={`${t('select')}...`}
              options={options}
              onChange={onChange || ((newValue) => setFieldValue(name, newValue))}
              getOptionLabel={(option) =>
                option.name.includes('{')
                  ? JSON.parse(option.name)[i18n.language] || '-'
                  : option.name
              }
              getOptionValue={(option) => option.id}
              value={options.length > 0 && value && value.name !== options[0].name ? value : ''}
              isMulti={isMulti}
            />
            {error ? <div className="text-sm text-red-500 error my-1 w-full">{error}</div> : null}
          </div>
        </>
      )}
    </Field>
  );
};

SelectInput.defaultProps = {
  error: '',
  id: '',
  isMulti: false,
  label: '',
  name: '',
  onChange: null,
  required: false,
  touched: false
};

SelectInput.propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  required: PropTypes.bool,
  touched: PropTypes.bool,
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(SelectInput);
