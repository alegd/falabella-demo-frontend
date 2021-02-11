import * as actionConstants from './actionConstants';

export const createSubSector = (subSector) => ({
  type: actionConstants.CREATE_SUB_SECTOR,
  subSector
});

export const selectSubSector = (subSector) => ({
  type: actionConstants.SELECT_SUB_SECTOR,
  data: subSector
});

export const getSubSectors = (query) => ({
  type: actionConstants.GET_SUB_SECTORS,
  query
});

export const getAllSubSectors = (query) => ({
  type: actionConstants.GET_ALL_SUB_SECTORS,
  query
});

export const searchSubSectors = (query) => ({
  type: actionConstants.SEARCH_SUB_SECTORS,
  query
});

export const deleteSubSector = (id) => ({
  type: actionConstants.DELETE_SUB_SECTOR,
  id
});

export const updateSubSector = (subSector) => ({
  type: actionConstants.UPDATE_SUB_SECTOR,
  subSector
});
