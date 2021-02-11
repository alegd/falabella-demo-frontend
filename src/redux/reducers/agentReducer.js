import { fromJS, isImmutable, List, Map } from 'immutable';
import * as actionConstants from '../actions/actionConstants';

const initialState = fromJS({
  agent: Map(),
  agents: List(),
  filters: List(),
  loading: false,
  total: 0,
  error: {}
});

const parseAgent = (data) => {
  const agent = isImmutable(data) ? data.toJS() : {};
  agent.municipality = agent.municipalityId
    ? { id: agent.municipalityId, name: agent.municipalityName }
    : null;
  agent.valueChain = agent.valueChainId
    ? { id: agent.valueChainId, name: agent.valueChainName }
    : null;
  agent.legalForm = agent.legalFormId ? { id: agent.legalFormId, name: agent.legalFormName } : null;
  delete agent.municipalityId;
  delete agent.municipalityName;
  delete agent.valueChainId;
  delete agent.valueChainName;
  delete agent.legalFormId;
  delete agent.legalFormName;
  return fromJS(agent);
};

const agentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.START_AGENTS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', true);
      });
    case actionConstants.CREATE_AGENT_SUCCESS:
      return state
        .update('agents', (data) => data.unshift(fromJS(action.data)))
        .set('loading', false);
    case actionConstants.GET_AGENTS_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .set('agents', fromJS(action.data))
          .set('filters', fromJS(action.filters))
          .set('total', action.total)
          .set('loading', false);
      });
    case actionConstants.GET_AGENT_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState
          .update('agent', () => {
            const agent = action.data;
            agent.municipality = agent.municipalityId
              ? { id: agent.municipalityId, name: agent.municipalityName }
              : null;
            agent.valueChain = agent.valueChainId
              ? { id: agent.valueChainId, name: agent.valueChainName }
              : null;
            agent.legalForm = agent.legalFormId
              ? { id: agent.legalFormId, name: agent.legalFormName }
              : null;
            delete agent.municipalityId;
            delete agent.municipalityName;
            delete agent.valueChainId;
            delete agent.valueChainName;
            delete agent.legalFormId;
            delete agent.legalFormName;
            return fromJS(agent);
          })
          .set('loading', false);
      });
    case actionConstants.UPDATE_AGENT_SUCCESS:
      return state
        .update('agents', (data) =>
          data.set(
            data.findIndex((item) => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('agent', Map())
        .set('loading', false);
    case actionConstants.DELETE_AGENT_SUCCESS:
      return state.withMutations((mutableState) => {
        const dataFiltered = mutableState
          .get('agents')
          .filter((agent) => agent.get('id') !== parseInt(action.id, 10));
        mutableState.set('agents', dataFiltered).set('agent', Map()).set('loading', false);
      });
    case actionConstants.FAILED_AGENTS_ACTION:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
      });
    case actionConstants.SELECT_AGENT:
      return state.withMutations((mutableState) => {
        mutableState.set('agent', parseAgent(action.data)).set('loading', false);
      });
    default:
      return state;
  }
};

export default agentReducer;
