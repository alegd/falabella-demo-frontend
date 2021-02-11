import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { withTranslation } from '../../../i18n';

const Navbar = ({ t }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('access_token'));
  }, []);

  return (
    <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between navbar-expand-lg">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6 md:justify-start md:space-x-10 w-full">
        <div className="lg:w-0 flex-1">
          {/* <a href="#" className="flex">
            <img className="h-10 w-auto sm:h-10" src="images/logo.svg" alt="Logo" />
          </a> */}
        </div>
        {isAuthenticated ? (
          <>
            <Link href="/agents">
              <a>
                <svg
                  className="mr-2 h-6 w-6 text-gray-700 group-hover:text-indigo-300 group-focus:text-indigo-300 transition ease-in-out duration-150"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </a>
            </Link>
            <UserMenu />
          </>
        ) : (
          <div className="md:flex items-center justify-end space-x-4 md:flex-1">
            <a
              href="/login"
              className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            >
              {t('login')}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(Navbar);
