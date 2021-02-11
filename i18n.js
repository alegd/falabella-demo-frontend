const NextI18Next = require('next-i18next').default;
const path = require('path');
const ICU = require('i18next-icu');

module.exports = new NextI18Next({
  use: [
    new ICU({
      localeData: 'es'
    })
  ],
  defaultLanguage: 'es',
  otherLanguages: ['eu', 'en'],
  localePath: path.resolve('./public/locales'),
  serverLanguageDetection: false,
  browserLanguageDetection: false,
  detection: {
    lookupCookie: 'next-i18next',
    order: ['cookie', 'querystring', 'localStorage', 'path', 'subdomain'],
    caches: ['cookie']
  }
});
