import * as actionConstants from './actionConstants';

export const getScopes = (query) => ({
  type: actionConstants.GET_SCOPES,
  query
});

export const selectScope = (scope) => ({
  type: actionConstants.SELECT_SCOPE,
  data: scope
});

export const searchScopes = (query) => ({
  type: actionConstants.SEARCH_SCOPES,
  query
});

export const deleteScope = (id) => ({
  type: actionConstants.DELETE_SCOPE,
  id
});

export const createScope = (scope) => ({
  type: actionConstants.CREATE_SCOPE,
  scope
});

export const updateScope = (scope) => ({
  type: actionConstants.UPDATE_SCOPE,
  scope
});
