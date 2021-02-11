import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { UserMenu } from 'components';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { HiOutlineTranslate as TranslateIcon } from 'react-icons/hi';
import { i18n, withTranslation } from '../../../i18n';

const Navbar = ({ t }) => {
  const router = useRouter();
  const title = router.pathname.substring(1);
  const lang = { es: 'Español', eu: 'Euskera', en: 'English' };

  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState(i18n.language);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageChanged = (value) => {
    setLanguage(value, i18n.changeLanguage(value));
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <nav
        className="bg-white w-full z-10 md:flex-row md:flex-no-wrap md:justify-start flex items-center px-4 py-2"
        style={{ left: '16rem' }}
      >
        <div className="w-full mx-auto items-center flex justify-between md:flex-no-wrap flex-wrap px-4">
          <a
            className="text-gray-800 capitalize text-lg lg:inline-block font-medium"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            {t(title, { amount: 2 })}
          </a>
          {/* 
          <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal text-center text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="{t('search')}......"
                className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10"
              />
            </div>
          </form> */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              style={{ textTransform: 'none' }}
              className="bg-gray-600"
            >
              <TranslateIcon className="mr-2" size={16} />
              {lang[language]}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleLanguageChanged('es')}>Español</MenuItem>
              <MenuItem onClick={() => handleLanguageChanged('eu')}>Euskera</MenuItem>
            </Menu>
            <UserMenu />
          </ul>
        </div>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(Navbar);
