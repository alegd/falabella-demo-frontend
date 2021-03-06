import { fromJS, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  valueChain: Map(),
  valueChains: List(),
  filters: List(),
  loading: false,
  total: 0,
  error: {}
});

const valueChainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_VALUE_CHAINS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.CREATE_VALUE_CHAIN_SUCCESS:
      return state
        .update('valueChains', (data) => data.unshift(fromJS(action.data)))
        .update('total', (total) => parseInt(total, 10) + 1)
        .set('valueChain', Map())
        .set('loading', false);
    case actionConstants.GET_VALUE_CHAINS_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('valueChains', fromJS(action.data))
          .set('filters', fromJS(action.filters))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.SELECT_VALUE_CHAIN:
      return state.withMutations((mutableState) => {
        mutableState.set('valueChain', fromJS(action.data)).set('loading', false);
      });
    case actionConstants.UPDATE_VALUE_CHAIN_SUCCESS:
      return state
        .update('valueChains', (data) =>
          data.set(
            data.findIndex((item) => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('valueChain', Map())
        .set('loading', false);
    case actionConstants.DELETE_VALUE_CHAIN_SUCCESS:
      return state.withMutations((mutableState) => {
        const dataFiltered = mutableState
          .get('valueChains')
          .filter((valueChain) => valueChain.get('id') !== parseInt(action.id, 10));
        mutableState
          .set('valueChains', dataFiltered)
          .update('total', (total) => parseInt(total, 10) - 1)
          .set('valueChain', Map())
          .set('loading', false);
      });
    case actionConstants.FAILED_VALUE_CHAINS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default valueChainReducer;
