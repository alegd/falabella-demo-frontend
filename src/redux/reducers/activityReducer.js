import { fromJS, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  activity: Map(),
  activities: List(),
  filters: List(),
  loading: false,
  total: 0,
  error: {}
});

const getActivities = (state, action) =>
  state.withMutations((mutableState) => {
    mutableState
      .set('activities', fromJS(action.data))
      .set('filters', fromJS(action.filters))
      .set('total', action.total)
      .set('loading', false);
  });

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_ACTIVITIES_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.CREATE_ACTIVITY_SUCCESS:
      return state
        .update('activities', (data) => data.unshift(fromJS(action.data)))
        .set('activity', Map())
        .set('loading', false);
    case actionConstants.GET_ACTIVITIES_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('activities', fromJS(action.data))
          .set('filters', fromJS(action.filters))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.GET_ALL_ACTIVITIES_SUCCESS:
      return getActivities(state, action);
    case actionConstants.SELECT_ACTIVITY:
      return state.withMutations((mutableState) => {
        mutableState
          .update('activity', () => {
            const sc = action.data;
            sc.subSector = { id: sc.subSectorId, name: sc.subSectorName };
            delete sc.subSectorId;
            delete sc.subSectorName;
            return fromJS(sc);
          })
          .set('loading', false);
      });
    case actionConstants.UPDATE_ACTIVITY_SUCCESS:
      return state
        .update('activities', (data) =>
          data.set(
            data.findIndex((item) => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('activity', Map())
        .set('loading', false);
    case actionConstants.DELETE_ACTIVITY_SUCCESS:
      return state.withMutations((mutableState) => {
        const dataFiltered = mutableState
          .get('activities')
          .filter((activity) => activity.get('id') !== parseInt(action.id, 10));
        mutableState.set('activities', dataFiltered).set('activity', Map()).set('loading', false);
      });
    case actionConstants.FAILED_ACTIVITIES_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default activityReducer;
