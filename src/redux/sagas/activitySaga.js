import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import createFilters from 'utils/filtering';
import * as actionConstants from '../actions/actionConstants';

const url = 'activities';

const parseActivity = (activity) => {
  const { subSector, ...rest } = activity;
  const { id: subSectorId, name: subSectorName } = subSector || {};
  return {
    subSectorId,
    subSectorName,
    ...rest
  };
};

const parseFilters = (filters) => {
  const { subSector, ...rest } = filters || {};
  const { id: subSectorId } = subSector || {};
  return { subSectorId, ...rest };
};

function* createActivity(params) {
  yield put({ type: actionConstants.START_ACTIVITIES_ACTION });
  const { activity } = params;
  const newActivity = parseActivity(activity);

  try {
    const response = yield axios.post(url, newActivity);
    const { data } = response;
    yield put({ type: actionConstants.CREATE_ACTIVITY_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_ACTIVITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchActivities(params) {
  yield put({ type: actionConstants.START_ACTIVITIES_ACTION });
  const query = get(params, 'query', {});
  const { subSectorId, page, size } = query;

  try {
    const response = yield axios.get(
      `${url}?subSectorId.equals=${subSectorId}&page=${page || 0}&size=${size || 20}`
    );
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_ACTIVITIES_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_ACTIVITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchAllActivities(params) {
  yield put({ type: actionConstants.START_ACTIVITIES_ACTION });
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
    yield put({ type: actionConstants.GET_ALL_ACTIVITIES_SUCCESS, data, total, filters });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_ACTIVITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchActivities(params) {
  yield put({ type: actionConstants.START_ACTIVITIES_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}?name.contains=${query}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_ACTIVITIES_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_ACTIVITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* updateActivity(params) {
  yield put({ type: actionConstants.START_ACTIVITIES_ACTION });
  const { activity } = params;
  const updatedActivity = parseActivity(activity);

  try {
    const response = yield axios.put(url, updatedActivity);
    const { data } = response;
    yield put({ type: actionConstants.UPDATE_ACTIVITY_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_ACTIVITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* deleteActivity(params) {
  yield put({ type: actionConstants.START_ACTIVITIES_ACTION });
  const { id } = params;

  try {
    yield axios.delete(`${url}/${id}`);
    yield put({ type: actionConstants.DELETE_ACTIVITY_SUCCESS, id });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_ACTIVITIES_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.CREATE_ACTIVITY, createActivity),
    takeLatest(actionConstants.GET_ACTIVITIES, fetchActivities),
    takeLatest(actionConstants.GET_ALL_ACTIVITIES, fetchAllActivities),
    takeLatest(actionConstants.SEARCH_ACTIVITIES, searchActivities),
    takeLatest(actionConstants.UPDATE_ACTIVITY, updateActivity),
    takeLatest(actionConstants.DELETE_ACTIVITY, deleteActivity)
  ]);
}
