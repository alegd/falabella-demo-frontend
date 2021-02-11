import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import createFilters from 'utils/filtering';
import * as actionConstants from '../actions/actionConstants';

const url = 'sub-sectors';

const parseSubSector = (subSector) => {
  const { sector, ...rest } = subSector;
  const { id: sectorId, name: sectorName } = sector || {};
  return {
    sectorId,
    sectorName,
    ...rest
  };
};

const parseFilters = (filters) => {
  const { sector, ...rest } = filters || {};
  const { id: sectorId } = sector || {};
  return { sectorId, ...rest };
};

function* createSubSector(params) {
  yield put({ type: actionConstants.START_SUB_SECTORS_ACTION });
  const { subSector } = params;
  const newSubSector = parseSubSector(subSector);

  try {
    const response = yield axios.post(url, newSubSector);
    const { data } = response;
    yield put({ type: actionConstants.CREATE_SUB_SECTOR_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SUB_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchSubSectors(params) {
  yield put({ type: actionConstants.START_SUB_SECTORS_ACTION });
  const query = get(params, 'query', {});
  const { sectorId, page, size } = query;

  try {
    const response = yield axios.get(
      `${url}?sectorId.equals=${sectorId}&page=${page || 0}&size=${size || 20}`
    );
    const { data } = response;
    yield put({ type: actionConstants.GET_SUB_SECTORS_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SUB_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchAllSubSectors(params) {
  yield put({ type: actionConstants.START_SUB_SECTORS_ACTION });
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
    yield put({ type: actionConstants.GET_SUB_SECTORS_SUCCESS, data, total, filters });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SUB_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchSubSectors(params) {
  yield put({ type: actionConstants.START_SUB_SECTORS_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}?name.contains=${query}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_SUB_SECTORS_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SUB_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* updateSubSector(params) {
  yield put({ type: actionConstants.START_SUB_SECTORS_ACTION });
  const { subSector } = params;
  const updatedSubSector = parseSubSector(subSector);

  try {
    const response = yield axios.put(url, updatedSubSector);
    const { data } = response;
    yield put({ type: actionConstants.UPDATE_SUB_SECTOR_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SUB_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* deleteSubSector(params) {
  yield put({ type: actionConstants.START_SUB_SECTORS_ACTION });
  const { id } = params;

  try {
    yield axios.delete(`${url}/${id}`);
    yield put({ type: actionConstants.DELETE_SUB_SECTOR_SUCCESS, id });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_SUB_SECTORS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.CREATE_SUB_SECTOR, createSubSector),
    takeLatest(actionConstants.GET_SUB_SECTORS, fetchSubSectors),
    takeLatest(actionConstants.GET_ALL_SUB_SECTORS, fetchAllSubSectors),
    takeLatest(actionConstants.SEARCH_SUB_SECTORS, searchSubSectors),
    takeLatest(actionConstants.UPDATE_SUB_SECTOR, updateSubSector),
    takeLatest(actionConstants.DELETE_SUB_SECTOR, deleteSubSector)
  ]);
}
