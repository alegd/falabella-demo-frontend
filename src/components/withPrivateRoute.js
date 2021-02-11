/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Router from 'next/router';

const login = '/login'; // Define your login route address.

/**
 * Check user authentication and authorization
 * It depends on you and your auth service provider.
 * @returns {{auth: null}}
 */

const withPrivateRoute = (accessToken, WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  const checkUserAuthentication = () => {
    return { auth: accessToken };
  };

  hocComponent.getInitialProps = async (context) => {
    const userAuth = await checkUserAuthentication();
    // Are you an authorized user or not?
    if (!userAuth?.auth) {
      // Handle server-side and client-side rendering.
      if (context.res) {
        context.res?.writeHead(302, {
          Location: login
        });
        context.res?.end();
      } else {
        Router.replace(login);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({ ...context, auth: userAuth });
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};

export default withPrivateRoute;
