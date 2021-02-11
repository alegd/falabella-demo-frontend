/* eslint-disable react/jsx-props-no-spreading */
import 'styles/index.css';
import 'styles/globals.css';

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import wrapper from 'redux/configureStore';

import { appWithTranslation } from '../../i18n';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({ Component, pageProps }) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="Content-Language" content="es" />
        <title>Agentes</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired
};

export default appWithTranslation(wrapper.withRedux(App));
