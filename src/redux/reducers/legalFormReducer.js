import { fromJS, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  legalForm: Map(),
  legalForms: List(),
  filters: List(),
  loading: false,
  total: 0,
  error: {}
});

const legalFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_LEGAL_FORMS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.CREATE_LEGAL_FORM_SUCCESS:
      return state
        .update('legalForms', (data) => data.unshift(fromJS(action.data)))
        .update('total', (total) => parseInt(total, 10) + 1)
        .set('legalForm', Map())
        .set('loading', false);
    case actionConstants.GET_LEGAL_FORMS_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('legalForms', fromJS(action.data))
          .set('filters', fromJS(action.filters))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.SELECT_LEGAL_FORM:
      return state.withMutations((mutableState) => {
        mutableState.set('legalForm', fromJS(action.data)).set('loading', false);
      });
    case actionConstants.UPDATE_LEGAL_FORM_SUCCESS:
      return state
        .update('legalForms', (data) =>
          data.set(
            data.findIndex((item) => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('legalForm', Map())
        .set('loading', false);
    case actionConstants.DELETE_LEGAL_FORM_SUCCESS:
      return state.withMutations((mutableState) => {
        const dataFiltered = mutableState
          .get('legalForms')
          .filter((legalForm) => legalForm.get('id') !== parseInt(action.id, 10));
        mutableState
          .update('total', (total) => parseInt(total, 10) - 1)
          .set('legalForms', dataFiltered)
          .set('legalForm', Map())
          .set('loading', false);
      });
    case actionConstants.FAILED_LEGAL_FORMS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default legalFormReducer;
