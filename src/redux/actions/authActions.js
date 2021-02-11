import * as actionConstants from './actionConstants';

export const login = (credentials) => ({
  type: actionConstants.LOGIN,
  credentials
});

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token.expiresAt');
  localStorage.removeItem('user');
  return {
    type: actionConstants.LOGOUT
  };
};

export const forgotPassword = (email) => ({
  type: actionConstants.RESET_PASSWORD,
  email
});
