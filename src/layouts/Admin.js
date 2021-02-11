import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AdminNavbar, withPrivateRoute } from 'components';
const Sidebar = dynamic(() => import('components/Sidebar/Sidebar'), {
  ssr: false
});

const accessToken = localStorage.getItem('access_token');

const Admin = ({ children }) => {
  const router = useRouter();

  if (!accessToken) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-gray-50">
        <AdminNavbar />
        <div className="mx-auto w-full">{children}</div>
      </div>
    </>
  );
};

Admin.propTypes = {
  children: PropTypes.node.isRequired
};

export default withPrivateRoute(accessToken, Admin);
