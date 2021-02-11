import * as actionConstants from './actionConstants';

export const getSectors = (query) => ({
  type: actionConstants.GET_SECTORS,
  query
});

export const getAllSectors = (query) => ({
  type: actionConstants.GET_ALL_SECTORS,
  query
});

export const selectSector = (sector) => ({
  type: actionConstants.SELECT_SECTOR,
  data: sector
});

export const searchSectors = (query) => ({
  type: actionConstants.SEARCH_SECTORS,
  query
});

export const deleteSector = (id) => ({
  type: actionConstants.DELETE_SECTOR,
  id
});

export const createSector = (sector) => ({
  type: actionConstants.CREATE_SECTOR,
  sector
});

export const updateSector = (sector) => ({
  type: actionConstants.UPDATE_SECTOR,
  sector
});
