import { fromJS, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  municipality: Map(),
  municipalities: List(),
  loading: false,
  total: 0,
  error: {}
});

const municipalityReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_MUNICIPALITIES_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_MUNICIPALITIES_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('municipalities', fromJS(action.data))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.FAILED_MUNICIPALITIES_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default municipalityReducer;
