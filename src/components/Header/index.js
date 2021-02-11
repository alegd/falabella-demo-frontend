import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'components';
import { IconContext } from 'react-icons';
import { MdViewList as ListIcon, MdApps as GridIcon } from 'react-icons/md';
import { withTranslation } from '../../../i18n';

const Navbar = ({ children, onSearch, onCreate, onViewChange, t }) => (
  <>
    <nav className="bg-white border-b border-gray-200 w-full z-10 md:flex-row md:flex-no-wrap md:justify-start flex items-center px-4 py-2">
      <div className="w-full mx-auto items-center flex justify-between md:flex-no-wrap flex-wrap lg:px-4">
        <div className="w-full flex justify-end items-center">
          <SearchBar className="w-full flex-grow" handleSearch={onSearch} size="small" />
          {children}

          <span className="relative z-0 inline-flex ml-4 py-1">
            <button
              type="button"
              className="w-10 relative inline-flex items-center px-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-600 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-900 transition ease-in-out duration-150"
              onClick={() => onViewChange(true)}
            >
              <IconContext.Provider value={{ size: '2em' }}>
                <ListIcon />
              </IconContext.Provider>
            </button>
            <button
              type="button"
              className="-ml-px w-10 relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-600 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-900 transition ease-in-out duration-150"
              onClick={() => onViewChange(false)}
            >
              <IconContext.Provider value={{ size: '2em' }}>
                <GridIcon />
              </IconContext.Provider>
            </button>
          </span>

          <button
            type="button"
            className="inline-flex ml-4 py-2 justify-center rounded-md px-4 bg-primary-main text-sm leading-5 font-medium text-white uppercase hover:bg-white hover:text-primary focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-300 border border-primary"
            onClick={onCreate}
          >
            {t('new')}
          </button>
        </div>
      </div>
    </nav>
  </>
);

Navbar.defaultProps = {
  children: [],
  onSearch: () => {},
  onCreate: () => {},
  onViewChange: () => {}
};

Navbar.propTypes = {
  children: PropTypes.array,
  onSearch: PropTypes.func,
  onCreate: PropTypes.func,
  onViewChange: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(Navbar);
