import * as actionConstants from './actionConstants';

export const getAgents = (query) => ({
  type: actionConstants.GET_AGENTS,
  query
});

export const getAgent = (id) => ({
  type: actionConstants.GET_AGENT,
  id
});

export const searchAgents = (query) => ({
  type: actionConstants.SEARCH_AGENTS,
  query
});

export const deleteAgent = (id) => ({
  type: actionConstants.DELETE_AGENT,
  id
});

export const createAgent = (agent) => ({
  type: actionConstants.CREATE_AGENT,
  agent
});

export const updateAgent = (agent) => ({
  type: actionConstants.UPDATE_AGENT,
  agent
});

export const selectAgent = (agent) => ({
  type: actionConstants.SELECT_AGENT,
  data: agent
});
