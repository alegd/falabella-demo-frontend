/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  // eslint-disable-next-line react/prop-types
  const { id, name, required, type, onAction, icon } = props;

  return (
    <>
      <div className="flex items-center h-8 mt-1 w-1/3">
        {label && (
          <label
            className={`block text-sm font-medium leading-5   ${
              meta.error ? 'text-red-500' : 'text-gray-700'
            }`}
            htmlFor={id || name}
          >
            {`${label} `}
            {required ? <span className="text-gray-500">*</span> : null}
          </label>
        )}
      </div>
      <div className="mt-1 mb-3 relative rounded-md flex-1">
        {type === 'textarea' ? (
          <textarea
            rows="3"
            className={`p-2 form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 border ${
              meta.error ? 'border-red-500' : 'border-gray-400'
            } rounded-md`}
            {...field}
            {...props}
          />
        ) : (
          <>
            <input
              className={`h-9 p-2 form-input block w-full border ${
                meta.error ? 'border-red-500' : 'border-gray-400'
              } sm:text-sm sm:leading-5 rounded-md`}
              {...field}
              {...props}
            />
            {onAction && (
              <div className="absolute top-0 pt-2 right-0 pr-3 flex items-center">
                <button type="button" onClick={onAction}>
                  {icon}
                </button>
              </div>
            )}
          </>
        )}
        {meta.error ? <div className="text-sm text-red-500 error my-1">{meta.error}</div> : null}
      </div>
    </>
  );
};

TextInput.defaultProps = {
  label: ''
};

TextInput.propTypes = {
  label: PropTypes.string,
  props: PropTypes.array.isRequired
};

export default TextInput;
