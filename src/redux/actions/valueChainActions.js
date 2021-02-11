import * as actionConstants from './actionConstants';

export const getValueChains = (query) => ({
  type: actionConstants.GET_VALUE_CHAINS,
  query
});

export const selectValueChain = (valueChain) => ({
  type: actionConstants.SELECT_VALUE_CHAIN,
  data: valueChain
});

export const searchValueChains = (query) => ({
  type: actionConstants.SEARCH_VALUE_CHAINS,
  query
});

export const deleteValueChain = (id) => ({
  type: actionConstants.DELETE_VALUE_CHAIN,
  id
});

export const createValueChain = (valueChain) => ({
  type: actionConstants.CREATE_VALUE_CHAIN,
  valueChain
});

export const updateValueChain = (valueChain) => ({
  type: actionConstants.UPDATE_VALUE_CHAIN,
  valueChain
});
