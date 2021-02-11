import React from 'react';
import PropTypes from 'prop-types';

const DateInput = ({ label, name, ...rest }) => (
  <>
    {label && (
      <label className="block text-sm font-medium leading-5 text-gray-700" htmlFor={name}>
        {label}
      </label>
    )}
    <div className="mt-1 mb-3 relative rounded-md">
      <input
        name={name}
        className="h-9 p-2 form-input block w-full border border-gray-400 sm:text-sm sm:leading-5 rounded-md"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
    </div>
  </>
);

DateInput.defaultProps = {
  label: ''
};

DateInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired
};

export default DateInput;
