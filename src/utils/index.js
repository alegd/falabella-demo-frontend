import { i18n } from '../../i18n';

export { default as getInitials } from './getInitials';

export const lang = { es: 'Español', eu: 'Euskera', en: 'English' };

// export const currentUser = localStorage.getItem('user')
//   ? JSON.parse(localStorage.getItem('user'))
//   : null;

// export const getUsername = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : null;

// export const userId = currentUser ? currentUser.id : null;

export const parseI18nName = (name, t) =>
  name.includes('{')
    ? JSON.parse(name)[i18n.language] || t('no-name', { lang: lang[i18n.language] })
    : name;
