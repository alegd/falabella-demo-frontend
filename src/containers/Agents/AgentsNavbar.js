import React from 'react';
import PropTypes from 'prop-types';
import { MdArrowBack as BackIcon } from 'react-icons/md';
import { IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';

const AgentsNavbar = ({ title, children }) => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-2 bg-gray-800 shadow-sm">
      <div className="w-full mx-autp items-center flex md:flex-no-wrap flex-wrap lg:px-4">
        <IconButton style={{ color: 'white', marginRight: 8 }} onClick={() => router.back()}>
          <BackIcon />
        </IconButton>
        <h3 className="text-lg leading-6 font-medium text-white">{title}</h3>
        <div className="flex flex-1 justify-end">{children}</div>
      </div>
    </nav>
  );
};

AgentsNavbar.defaultProps = {
  title: '',
  children: null
};

AgentsNavbar.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default AgentsNavbar;
