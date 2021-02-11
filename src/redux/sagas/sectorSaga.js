import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import createFilters from 'utils/filtering';
import * as actionConstants from '../actions/actionConstants';

const url = 'sectors';

const parseSector = (sector) => {
  const { scope, ...rest } = sector;
  const { id: scopeId, name: scopeName } = scope || {};
  return {
    scopeId,
    scopeName,
    ...rest
  };
};

const parseFilters = (filters) => {
  const { scope, ...rest } = filters || {};
  const { id: scopeId } = scope || {};
  return { scopeId, ...rest };
};

function* createSector(params) {
  yield put({ type: actionConstants.START_SECTORS_ACTION });
  const { sector } = params;
  const newSector = parseSector(sector);

  try {
    const response = yield axios.post(url, newSector);
    const { data } = response;
    yield put({ type: actionConstants.CREATE_SECTOR_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchSectors(params) {
  yield put({ type: actionConstants.START_SECTORS_ACTION });
  const query = get(params, 'query', {});
  const { scopeId, page, size } = query;

  try {
    const response = yield axios.get(
      `${url}?scopeId.equals=${scopeId}&page=${page || 0}&size=${size || 20}`
    );
    const { data } = response;
    yield put({ type: actionConstants.GET_SECTORS_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchAllSectors(params) {
  yield put({ type: actionConstants.START_SECTORS_ACTION });
  const query = get(params, 'query', {});
  const { page, size, filters } = query;
  const parsedFilters = parseFilters(filters);
  const filterString = parsedFilters ? createFilters(parsedFilters) : '';

  try {
    const response = yield axios.get(
      `${url}?page=${page || 0}&size=${size || 20}${
        filterString.length > 0 ? '&' + filterString : ''
      }`
    );
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_ALL_SECTORS_SUCCESS, data, total, filters });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchSectors(params) {
  yield put({ type: actionConstants.START_SECTORS_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}?name.contains=${query}`);
    const { data } = response;
    const count = yield axios.get(`${url}/count?name.contains=${query}`);
    const { data: total } = count;
    yield put({ type: actionConstants.GET_SECTORS_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* updateSector(params) {
  yield put({ type: actionConstants.START_SECTORS_ACTION });
  const { sector } = params;
  const updatedSector = parseSector(sector);

  try {
    const response = yield axios.put(url, updatedSector);
    const { data } = response;
    yield put({ type: actionConstants.UPDATE_SECTOR_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* deleteSector(params) {
  yield put({ type: actionConstants.START_SECTORS_ACTION });
  const { id } = params;

  try {
    yield axios.delete(`${url}/${id}`);
    yield put({ type: actionConstants.DELETE_SECTOR_SUCCESS, id });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.CREATE_SECTOR, createSector),
    takeLatest(actionConstants.GET_SECTORS, fetchSectors),
    takeLatest(actionConstants.GET_ALL_SECTORS, fetchAllSectors),
    takeLatest(actionConstants.SEARCH_SECTORS, searchSectors),
    takeLatest(actionConstants.UPDATE_SECTOR, updateSector),
    takeLatest(actionConstants.DELETE_SECTOR, deleteSector)
  ]);
}
