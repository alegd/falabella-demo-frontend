import * as actionConstants from './actionConstants';

export const createActivity = (activity) => ({
  type: actionConstants.CREATE_ACTIVITY,
  activity
});

export const selectActivity = (activity) => ({
  type: actionConstants.SELECT_ACTIVITY,
  data: activity
});

export const getActivities = (query) => ({
  type: actionConstants.GET_ACTIVITIES,
  query
});

export const getAllActivities = (query) => ({
  type: actionConstants.GET_ALL_ACTIVITIES,
  query
});

export const searchActivities = (query) => ({
  type: actionConstants.SEARCH_ACTIVITIES,
  query
});

export const deleteActivity = (id) => ({
  type: actionConstants.DELETE_ACTIVITY,
  id
});

export const updateActivity = (activity) => ({
  type: actionConstants.UPDATE_ACTIVITY,
  activity
});
