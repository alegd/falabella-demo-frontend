import { fromJS, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  sector: Map(),
  sectors: List(),
  filters: List(),
  loading: false,
  total: 0,
  error: {}
});

const getSectors = (state, action) =>
  state.withMutations((mutableState) => {
    mutableState
      .set('sectors', fromJS(action.data))
      .set('filters', fromJS(action.filters))
      .set('total', action.total)
      .set('loading', false);
  });

const sectorReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_SECTORS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.CREATE_SECTOR_SUCCESS:
      return state
        .update('sectors', (data) => data.unshift(fromJS(action.data)))
        .update('total', (total) => parseInt(total, 10) + 1)
        .set('sector', Map())
        .set('loading', false);
    case actionConstants.GET_SECTORS_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('sectors', fromJS(action.data))
          .set('filters', fromJS(action.filters))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.GET_ALL_SECTORS_SUCCESS:
      return getSectors(state, action);
    case actionConstants.SELECT_SECTOR:
      return state.withMutations((mutableState) => {
        mutableState
          .update('sector', () => {
            const sc = action.data;
            sc.scope = { id: sc.scopeId, name: sc.scopeName };
            delete sc.scopeId;
            delete sc.scopeName;
            return fromJS(sc);
          })
          .set('loading', false);
      });
    case actionConstants.UPDATE_SECTOR_SUCCESS:
      return state
        .update('sectors', (data) =>
          data.set(
            data.findIndex((item) => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('sector', Map())
        .set('loading', false);
    case actionConstants.DELETE_SECTOR_SUCCESS:
      return state.withMutations((mutableState) => {
        const dataFiltered = mutableState
          .get('sectors')
          .filter((sector) => sector.get('id') !== parseInt(action.id, 10));
        mutableState
          .update('total', (total) => parseInt(total, 10) - 1)
          .set('sectors', dataFiltered)
          .set('sector', Map())
          .set('loading', false);
      });
    case actionConstants.FAILED_SECTORS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default sectorReducer;
