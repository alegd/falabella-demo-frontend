import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import menu from 'config/menu';
import { MdMenu as MenuIcon } from 'react-icons/md';
import NotificationDropdown from 'components/Dropdowns/NotificationDropdown.js';
import { UserMenu } from 'components';
import { withTranslation } from '../../../i18n';

const Sidebar = ({ t }) => {
  const [collapseShow, setCollapseShow] = React.useState('hidden');
  const router = useRouter();

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl  flex flex-wrap items-center justify-between relative md:w-64 z-10 bg-gray-800">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center w-full mx-auto">
          <button
            className="cursor-pointer text-white opacity-50 md:hidden py-1 text-xl leading-none bg-transparent border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow('bg-white py-3 px-6')}
          >
            <MenuIcon size={20} />
          </button>
          <div className="flex justify-between bg-gray-900 px-4 py-1 w-full">
            <Link href="/">
              <a
                href="/"
                className="flex items-center text-left text-gray-200 mr-0 whitespace-no-wrap text-lg font-bold p-2 px-0"
              >
                <img className="h-8 w-auto mr-4" src="images/logo.svg" alt="Logo" />
                Oarsoaldea
              </a>
            </Link>

            <ul className="md:hidden items-center flex flex-wrap list-none">
              <li className="inline-block relative">
                <NotificationDropdown />
              </li>
              <li className="inline-block relative">
                <UserMenu />
              </li>
            </ul>
          </div>
          {/* Collapse */}
          <div
            className={
              'md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ' +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link href="/">
                    <a
                      href="#"
                      className="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0"
                    >
                      Oarsoaldea
                    </a>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-white opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow('hidden')}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            {/* <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-3 py-2 h-12 border border-solid  border-gray-600 placeholder-gray-400 text-gray-700 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form> */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none px-4 py-4">
              {menu.map((item) => (
                <li key={item.key} className="items-center">
                  <Link href={item.link} shallow>
                    <a
                      className={
                        router.pathname.indexOf(item.link) !== -1
                          ? 'text-primary hover:text-primary bg-gray-900'
                          : 'text-gray-500 hover:text-gray-400'
                      }
                    >
                      <div
                        className={`flex capitalize text-sm py-3 px-2 font-bold rounded-md items-center ${
                          router.pathname.indexOf(item.link) !== -1 ? 'bg-gray-900' : ''
                        }`}
                      >
                        {item.icon && <span className="mr-3">{item.icon}</span>}
                        {t(item.key, { amount: 2 })}
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

Sidebar.propTypes = {
  t: PropTypes.object.isRequired
};

export default withTranslation('common')(Sidebar);
