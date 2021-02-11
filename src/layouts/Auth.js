import React from 'react';
import PropTypes from 'prop-types';

const Auth = ({ children }) => {
  return (
    <>
      {/* <Navbar transparent /> */}
      <main>
        <section className="relative w-full h-full min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-gray-900 bg-no-repeat bg-full"
            // style={{
            //   backgroundImage: 'url("images/register_bg_2.png")',
            //   backgroundSize: 'cover'
            // }}
          />
          {children}
          {/* <FooterSmall absolute /> */}
        </section>
      </main>
    </>
  );
};

Auth.propTypes = {
  children: PropTypes.node.isRequired
};

export default Auth;
