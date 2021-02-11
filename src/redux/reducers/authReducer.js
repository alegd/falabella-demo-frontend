import { fromJS } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  loading: false,
  error: {}
});

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_AUTH_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.LOGIN_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', false);
      });
    case actionConstants.LOGIN_FAIL:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default authReducer;
