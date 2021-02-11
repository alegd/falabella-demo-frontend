import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import createFilters from 'utils/filtering';
import * as actionConstants from '../actions/actionConstants';

const url = 'scopes';

function* createScope(params) {
  yield put({ type: actionConstants.START_SCOPES_ACTION });
  const { scope } = params;

  try {
    const response = yield axios.post(url, scope);
    const { data } = response;
    yield put({ type: actionConstants.CREATE_SCOPE_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SCOPES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchScopes(params) {
  yield put({ type: actionConstants.START_SCOPES_ACTION });
  const query = get(params, 'query', {});
  const { page, size, filters } = query;
  const filterString = filters ? createFilters(filters) : '';

  try {
    const response = yield axios.get(
      `${url}?page=${page || 0}&size=${size || 20}${
        filterString.length > 0 ? '&' + filterString : ''
      }`
    );
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_SCOPES_SUCCESS, data, total, filters });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SCOPES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchScopes(params) {
  yield put({ type: actionConstants.START_SCOPES_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}?name.contains=${query}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_SCOPES_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SCOPES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* updateScope(params) {
  yield put({ type: actionConstants.START_SCOPES_ACTION });
  const { scope } = params;

  try {
    const response = yield axios.put(url, scope);
    const { data } = response;
    yield put({ type: actionConstants.UPDATE_SCOPE_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SCOPES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* deleteScope(params) {
  yield put({ type: actionConstants.START_SCOPES_ACTION });
  const { id } = params;

  try {
    yield axios.delete(`${url}/${id}`);
    yield put({ type: actionConstants.DELETE_SCOPE_SUCCESS, id });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SCOPES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.CREATE_SCOPE, createScope),
    takeLatest(actionConstants.GET_SCOPES, fetchScopes),
    takeLatest(actionConstants.SEARCH_SCOPES, searchScopes),
    takeLatest(actionConstants.UPDATE_SCOPE, updateScope),
    takeLatest(actionConstants.DELETE_SCOPE, deleteScope)
  ]);
}
