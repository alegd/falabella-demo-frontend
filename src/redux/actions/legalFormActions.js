import * as actionConstants from './actionConstants';

export const getLegalForms = (query) => ({
  type: actionConstants.GET_LEGAL_FORMS,
  query
});

export const selectLegalForm = (legalForm) => ({
  type: actionConstants.SELECT_LEGAL_FORM,
  data: legalForm
});

export const searchLegalForms = (query) => ({
  type: actionConstants.SEARCH_LEGAL_FORMS,
  query
});

export const deleteLegalForm = (id) => ({
  type: actionConstants.DELETE_LEGAL_FORM,
  id
});

export const createLegalForm = (legalForm) => ({
  type: actionConstants.CREATE_LEGAL_FORM,
  legalForm
});

export const updateLegalForm = (legalForm) => ({
  type: actionConstants.UPDATE_LEGAL_FORM,
  legalForm
});
