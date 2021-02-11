import { fromJS, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  subSector: Map(),
  subSectors: List(),
  filters: List(),
  loading: false,
  total: 0,
  error: {}
});

const getSubSectors = (state, action) =>
  state.withMutations((mutableState) => {
    mutableState
      .set('subSectors', fromJS(action.data))
      .set('filters', fromJS(action.filters))
      .set('total', action.total)
      .set('loading', false);
  });

const subSectorReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_SUB_SECTORS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.CREATE_SUB_SECTOR_SUCCESS:
      return state
        .update('subSectors', (data) => data.unshift(fromJS(action.data)))
        .update('total', (total) => parseInt(total, 10) + 1)
        .set('subSector', Map())
        .set('loading', false);
    case actionConstants.GET_SUB_SECTORS_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('subSectors', fromJS(action.data))
          .set('filters', fromJS(action.filters))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.GET_ALL_SUB_SECTORS_SUCCESS:
      return getSubSectors(state, action);
    case actionConstants.SELECT_SUB_SECTOR:
      return state.withMutations((mutableState) => {
        mutableState
          .update('subSector', () => {
            const sc = action.data;
            sc.sector = { id: sc.sectorId, name: sc.sectorName };
            delete sc.sectorId;
            delete sc.sectorName;
            return fromJS(sc);
          })
          .set('loading', false);
      });
    case actionConstants.UPDATE_SUB_SECTOR_SUCCESS:
      return state
        .update('subSectors', (data) =>
          data.set(
            data.findIndex((item) => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('subSector', Map())
        .set('loading', false);
    case actionConstants.DELETE_SUB_SECTOR_SUCCESS:
      return state.withMutations((mutableState) => {
        const dataFiltered = mutableState
          .get('subSectors')
          .filter((subSector) => subSector.get('id') !== parseInt(action.id, 10));
        mutableState
          .update('total', (total) => parseInt(total, 10) - 1)
          .set('subSectors', dataFiltered)
          .set('subSector', Map())
          .set('loading', false);
      });
    case actionConstants.FAILED_SUB_SECTORS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};

export default subSectorReducer;
