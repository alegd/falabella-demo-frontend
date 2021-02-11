import { all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'utils/axios-requests';
import createFilters from 'utils/filtering';
import * as actionConstants from '../actions/actionConstants';

const url = 'agents';

const parseAgent = (agent) => {
  const { municipality, valueChain, legalForm, ...rest } = agent;
  const { id: municipalityId, name: municipalityName } = municipality || {};
  const { id: valueChainId, name: valueChainName } = valueChain || {};
  const { id: legalFormId, name: legalFormName } = legalForm || {};
  return {
    municipalityId,
    municipalityName,
    valueChainId,
    valueChainName,
    legalFormId,
    legalFormName,
    ...rest
  };
};

const parseFilters = (filters) => {
  const { activity, valueChain, legalForm, ...rest } = filters || {};
  const { id: activityId } = activity || {};
  const { id: valueChainId } = valueChain || {};
  const { id: legalFormId } = legalForm || {};
  return {
    activityId,
    valueChainId,
    legalFormId,
    ...rest
  };
};

function* createAgent(params) {
  yield put({ type: actionConstants.START_AGENTS_ACTION });
  const { agent } = params;
  const newAgent = parseAgent(agent);
  try {
    const response = yield axios.post(url, newAgent);
    const {
      data: { id }
    } = response;
    newAgent.id = id;
    yield put({ type: actionConstants.CREATE_AGENT_SUCCESS, data: newAgent });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_AGENTS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchAgents(params) {
  yield put({ type: actionConstants.START_AGENTS_ACTION });
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
    yield put({ type: actionConstants.GET_AGENTS_SUCCESS, data, total, filters });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_AGENTS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* fetchAgent(params) {
  yield put({ type: actionConstants.START_AGENTS_ACTION });
  const id = get(params, 'id', 0);

  try {
    const response = yield axios.get(`${url}/${id}`);
    const { data } = response;
    yield put({ type: actionConstants.GET_AGENT_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_AGENTS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* searchAgents(params) {
  yield put({ type: actionConstants.START_AGENTS_ACTION });
  const { query } = params;

  try {
    const response = yield axios.get(`${url}/search?contains=${query}`);
    const { data, headers } = response;
    const total = headers['x-total-count'];
    yield put({ type: actionConstants.GET_AGENTS_SUCCESS, data, total });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_AGENTS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* updateAgent(params) {
  yield put({ type: actionConstants.START_AGENTS_ACTION });
  const { agent } = params;
  const updatedAgent = parseAgent(agent);

  try {
    const response = yield axios.put(url, updatedAgent);
    const { data } = response;
    yield put({ type: actionConstants.UPDATE_AGENT_SUCCESS, data });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_AGENTS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

function* deleteAgent(params) {
  yield put({ type: actionConstants.START_AGENTS_ACTION });
  const { id } = params;

  try {
    yield axios.delete(`${url}/${id}`);
    yield put({ type: actionConstants.DELETE_AGENT_SUCCESS, id });
  } catch (error) {
    yield all([
      put({ type: actionConstants.FAILED_AGENTS_ACTION, error }),
      put({ type: actionConstants.ADD_NOTIFICATION, notification: error })
    ]);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.CREATE_AGENT, createAgent),
    takeLatest(actionConstants.GET_AGENTS, fetchAgents),
    takeLatest(actionConstants.GET_AGENT, fetchAgent),
    takeLatest(actionConstants.SEARCH_AGENTS, searchAgents),
    takeLatest(actionConstants.UPDATE_AGENT, updateAgent),
    takeLatest(actionConstants.DELETE_AGENT, deleteAgent)
  ]);
}
