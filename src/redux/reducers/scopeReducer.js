import { fromJS, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  scope: Map(),
  scopes: List(),
  filters: List(),
  loading: false,
  total: 0,
  error: {}
});

const scopeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_SCOPES_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.CREATE_SCOPE_SUCCESS:
      return state
        .update('scopes', (data) => data.unshift(fromJS(action.data)))
        .update('total', (total) => parseInt(total, 10) + 1)
        .set('scope', Map())
        .set('loading', false);
    case actionConstants.GET_SCOPES_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('scopes', fromJS(action.data))
          .set('filters', fromJS(action.filters))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.SELECT_SCOPE:
      return state.withMutations((mutableState) => {
        mutableState.set('scope', fromJS(action.data)).set('loading', false);
      });
    case actionConstants.UPDATE_SCOPE_SUCCESS:
      return state
        .update('scopes', (data) =>
          data.set(
            data.findIndex((item) => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('scope', Map())
        .set('loading', false);
    case actionConstants.DELETE_SCOPE_SUCCESS:
      return state.withMutations((mutableState) => {
        const dataFiltered = mutableState
          .get('scopes')
          .filter((scope) => scope.get('id') !== parseInt(action.id, 10));
        mutableState
          .update('total', (total) => parseInt(total, 10) - 1)
          .set('scopes', dataFiltered)
          .set('scope', Map())
          .set('loading', false);
      });
    case actionConstants.FAILED_SCOPES_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default scopeReducer;
