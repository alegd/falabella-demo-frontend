import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Transition } from '@headlessui/react';
import { IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { logout } from 'redux/actions';
import { withTranslation } from '../../../i18n';

const UserMenu = ({ onLogout, t }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('access_token'));
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  const handleLogout = () => {
    onLogout();
    router.push('/login');
  };

  return (
    <div className="relative text-left ml-4">
      {!isAuthenticated ? (
        <div className="md:flex items-center justify-end space-x-4 md:flex-1">
          <a
            href="/login"
            className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
          >
            {t('login')}
          </a>
        </div>
      ) : (
        <>
          <IconButton onClick={() => setOpen(!open)} size="small">
            <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
              <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </IconButton>

          <Transition
            show={open}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {(ref) => (
              <div
                ref={ref}
                className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg"
              >
                <div
                  className="rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm leading-5">
                      {`Registrado como `}
                      <span className="text-sm leading-5 font-medium text-gray-900 truncate">
                        {user.login}
                      </span>
                    </p>
                  </div>
                  <div className="border-t border-gray-100" />
                  <div className="py-1">
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                      onClick={handleLogout}
                    >
                      {t('logout')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logout())
});

export default connect(null, mapDispatchToProps)(withTranslation('common')(UserMenu));
