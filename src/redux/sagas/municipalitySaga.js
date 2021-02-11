import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import * as actionConstants from '../actions/actionConstants';

const url = 'municipalities';

function* fetchMunicipalities(params) {
  yield put({ type: actionConstants.START_MUNICIPALITIES_ACTION });
  const query = get(params, 'query', {});
  const { page, size } = query;

  try {
    const response = yield axios.get(`${url}?page=${page || 0}&size=${size || 20}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_MUNICIPALITIES_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_MUNICIPALITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchMunicipalities(params) {
  yield put({ type: actionConstants.START_MUNICIPALITIES_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}?name.contains=${query}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_MUNICIPALITIES_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_MUNICIPALITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.GET_MUNICIPALITIES, fetchMunicipalities),
    takeLatest(actionConstants.SEARCH_MUNICIPALITIES, searchMunicipalities)
  ]);
}
