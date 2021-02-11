// const withPlugins = require("next-compose-plugins");
const withImages = require('next-images');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
// const webpack = require('webpack');
const path = require('path');

const { nextI18NextRewrites } = require('next-i18next/rewrites');

const localeSubpaths = {};

module.exports = withFonts(
  withCSS(
    withImages(
      withSass({
        webpack: (config) => {
          config.module.rules.push({
            test: /\.(eot|ttf|woff|woff2)$/,
            use: {
              loader: 'url-loader'
            }
          });
          config.resolve.modules.push(path.resolve('./src'));
          return config;
        },
        rewrites: async () => nextI18NextRewrites(localeSubpaths),
        publicRuntimeConfig: {
          localeSubpaths
        }
      })
    )
  )
);
