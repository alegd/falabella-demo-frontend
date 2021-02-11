import * as actionConstants from './actionConstants';

export const getMunicipalities = (query) => ({
  type: actionConstants.GET_MUNICIPALITIES,
  query
});

export const searchMunicipalities = (query) => ({
  type: actionConstants.SEARCH_MUNICIPALITIES,
  query
});
