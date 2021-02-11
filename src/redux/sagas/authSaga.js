import { all, call, put, takeLatest } from 'redux-saga/effects';
import Router from 'next/router';
import axios from 'utils/axios-requests';
import * as actionConstants from '../actions/actionConstants';

function* login(params) {
  yield put({ type: actionConstants.START_AUTH_ACTION });
  const { credentials } = params;

  try {
    const response = yield axios.post(`authenticate`, credentials);
    const { data: token } = response;
    localStorage.setItem('access_token', token.id_token);
    const now = new Date();
    localStorage.setItem(
      'access_token.expiresAt',
      now.getTime() + 1000 * 60 * 60 * 24 * (credentials.rememberMe ? 30 : 1)
    );

    const user = yield axios.get(`users/${credentials.username}`);
    const { data } = user;
    localStorage.setItem('user', JSON.stringify(data));
    yield put({ type: actionConstants.LOGIN_SUCCESS, data });
    yield call(Router.push, '/');
  } catch (error) {
    yield all([
      put({ type: actionConstants.LOGIN_FAIL, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* resetPassword(params) {
  yield put({ type: actionConstants.START_AUTH_ACTION });
  const { email: mail } = params;

  try {
    const response = yield axios.post('account/reset-password/init', mail);
    const { data } = response;
    yield put({ type: actionConstants.RESET_PASSWORD_SUCCESS, data });
    yield call(Router.push, '/');
  } catch (error) {
    yield all([
      put({ type: actionConstants.RESET_PASSWORD_FAIL, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.LOGIN, login),
    takeLatest(actionConstants.RESET_PASSWORD, resetPassword)
  ]);
}
