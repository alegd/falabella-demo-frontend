import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import createFilters from 'utils/filtering';
import * as actionConstants from '../actions/actionConstants';

const url = 'legal-forms';

function* createLegalForm(params) {
  yield put({ type: actionConstants.START_LEGAL_FORMS_ACTION });
  const { legalForm } = params;

  try {
    const response = yield axios.post(url, legalForm);
    const { data } = response;
    yield put({ type: actionConstants.CREATE_LEGAL_FORM_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_LEGAL_FORMS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchLegalForms(params) {
  yield put({ type: actionConstants.START_LEGAL_FORMS_ACTION });
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
    yield put({ type: actionConstants.GET_LEGAL_FORMS_SUCCESS, data, total, filters });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_LEGAL_FORMS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchLegalForms(params) {
  yield put({ type: actionConstants.START_LEGAL_FORMS_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}?name.contains=${query}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_LEGAL_FORMS_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_LEGAL_FORMS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* updateLegalForm(params) {
  yield put({ type: actionConstants.START_LEGAL_FORMS_ACTION });
  const { legalForm } = params;

  try {
    const response = yield axios.put(url, legalForm);
    const { data } = response;
    yield put({ type: actionConstants.UPDATE_LEGAL_FORM_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_LEGAL_FORMS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* deleteLegalForm(params) {
  yield put({ type: actionConstants.START_LEGAL_FORMS_ACTION });
  const { id } = params;

  try {
    yield axios.delete(`${url}/${id}`);
    yield put({ type: actionConstants.DELETE_LEGAL_FORM_SUCCESS, id });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_LEGAL_FORMS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.CREATE_LEGAL_FORM, createLegalForm),
    takeLatest(actionConstants.GET_LEGAL_FORMS, fetchLegalForms),
    takeLatest(actionConstants.SEARCH_LEGAL_FORMS, searchLegalForms),
    takeLatest(actionConstants.UPDATE_LEGAL_FORM, updateLegalForm),
    takeLatest(actionConstants.DELETE_LEGAL_FORM, deleteLegalForm)
  ]);
}
