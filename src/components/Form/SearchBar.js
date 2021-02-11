import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { MdSearch as SearchIcon } from 'react-icons/md';
import { withTranslation } from '../../../i18n';

const SearchBar = ({ handleSearch, size, t }) => {
  const formik = useFormik({
    initialValues: {
      search: ''
    },
    onSubmit: (values) => {
      handleSearch(values);
    }
  });

  return (
    <form className="w-full lg:w-1/3" onSubmit={formik.handleSubmit}>
      <div className="relative flex w-full flex-wrap items-stretch">
        <span
          className={`z-10 h-full leading-snug font-normal absolute text-center text-gray-400 bg-transparent rounded text-base items-center justify-center w-8 pl-${
            size === 'small' ? '3' : '2'
          } py-${size === 'small' ? '2' : '3'}`}
        >
          <SearchIcon size="large" />
        </span>
        <input
          id="search"
          name="search"
          type="text"
          placeholder={`${t('search')}...`}
          className={`px-3 py-${
            size === 'small' ? '2' : '3'
          } placeholder-gray-400 text-gray-700 relative bg-white rounded-lg text-md border border-gray-300 outline-none focus:outline-none focus:shadow w-full pl-10`}
          onChange={formik.handleChange}
          value={formik.values.search}
        />
      </div>
    </form>
  );
};

SearchBar.defaultProps = {
  size: ''
};

SearchBar.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  size: PropTypes.string,
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(SearchBar);
