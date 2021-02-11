/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers } from 'redux-immutable';
import authReducer from './reducers/authReducer';
import activityReducer from './reducers/activityReducer';
import agentReducer from './reducers/agentReducer';
import municipalityReducer from './reducers/municipalityReducer';
import sectorReducer from './reducers/sectorReducer';
import valueChainReducer from './reducers/valueChainReducer';
import legalFormReducer from './reducers/legalFormReducer';
import subSectorReducer from './reducers/subSectorReducer';
import scopeReducer from './reducers/scopeReducer';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    auth: authReducer,
    activity: activityReducer,
    agent: agentReducer,
    sector: sectorReducer,
    municipality: municipalityReducer,
    valueChain: valueChainReducer,
    legalForm: legalFormReducer,
    subSector: subSectorReducer,
    scope: scopeReducer,
    ...injectedReducers
  });

  return rootReducer;
}
