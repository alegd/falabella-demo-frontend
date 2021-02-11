import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import createFilters from 'utils/filtering';
import * as actionConstants from '../actions/actionConstants';

const url = 'value-chains';

function* createvalueChain(params) {
  yield put({ type: actionConstants.START_VALUE_CHAINS_ACTION });
  const { valueChain } = params;

  try {
    const response = yield axios.post(url, valueChain);
    const { data } = response;
    yield put({ type: actionConstants.CREATE_VALUE_CHAIN_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_VALUE_CHAINS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchvalueChains(params) {
  yield put({ type: actionConstants.START_VALUE_CHAINS_ACTION });
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
    yield put({ type: actionConstants.GET_VALUE_CHAINS_SUCCESS, data, total, filters });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_VALUE_CHAINS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchvalueChains(params) {
  yield put({ type: actionConstants.START_VALUE_CHAINS_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}?name.contains=${query}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_VALUE_CHAINS_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_VALUE_CHAINS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* updatevalueChain(params) {
  yield put({ type: actionConstants.START_VALUE_CHAINS_ACTION });
  const { valueChain } = params;

  try {
    const response = yield axios.put(url, valueChain);
    const { data } = response;
    yield put({ type: actionConstants.UPDATE_VALUE_CHAIN_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_VALUE_CHAINS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* deletevalueChain(params) {
  yield put({ type: actionConstants.START_VALUE_CHAINS_ACTION });
  const { id } = params;

  try {
    yield axios.delete(`${url}/${id}`);
    yield put({ type: actionConstants.DELETE_VALUE_CHAIN_SUCCESS, id });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_VALUE_CHAINS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.CREATE_VALUE_CHAIN, createvalueChain),
    takeLatest(actionConstants.GET_VALUE_CHAINS, fetchvalueChains),
    takeLatest(actionConstants.SEARCH_VALUE_CHAINS, searchvalueChains),
    takeLatest(actionConstants.UPDATE_VALUE_CHAIN, updatevalueChain),
    takeLatest(actionConstants.DELETE_VALUE_CHAIN, deletevalueChain)
  ]);
}
