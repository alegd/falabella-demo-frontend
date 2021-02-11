import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { ConfirmationDialog, Header, AppliedFilters, Pagination } from 'components';
import { SimpleCard, ActivityForm, ActivityListItem, ActivitiesFilter } from 'containers';
import {
  getAllSubSectors,
  getAllActivities,
  searchActivities,
  selectActivity,
  deleteActivity
} from 'redux/actions';
import { removeFilter } from 'utils/filtering';
import { withTranslation } from '../../../i18n';

const Admin = dynamic(() => import('layouts/Admin'), { ssr: false });

const Activities = ({
  activity,
  activities,
  filters,
  loading,
  onGetAllSubSectors,
  onGetActivities,
  onSearchActivities,
  onSelectActivity,
  onDeleteActivity,
  total,
  t
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    onGetAllSubSectors({ size: 150 });
    onGetActivities({ page });
    setSize(20); // TODO: Change size
  }, []);

  const parseFilters = () => {
    const { subSector, ...rest } = filters.toJS();
    const { name: subSectorName } = subSector || {};
    return {
      subSector: subSectorName,
      ...rest
    };
  };

  const parseFilterName = (filter) => {
    switch (filter) {
      case 'name':
        return t('name');
      case 'subSector':
        return t('sub-sector');
      default:
        return '';
    }
  };

  const onSearch = (values) => {
    onSearchActivities(values.search);
  };

  const changePage = (value) => {
    setPage(value, onGetActivities({ page: value }));
  };

  const handleClose = () => {
    setOpenForm(false, onSelectActivity({}));
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false, onSelectActivity({}));
  };

  const handleDeleteConfirm = () => {
    onDeleteActivity(activity.get('id'));
    onSelectActivity({});
    setOpenDialog(false);
  };

  return (
    <>
      <Header
        className="mt-20"
        onSearch={onSearch}
        onCreate={() => setOpenForm(true)}
        onViewChange={setListView}
      >
        <div className="ml-4 py-1">
          <ActivitiesFilter />
        </div>
      </Header>

      {filters ? (
        <AppliedFilters
          filters={parseFilters()}
          parseFilterName={parseFilterName}
          onRemoveFilter={(value) => removeFilter(value, filters, onGetActivities)}
        />
      ) : null}

      <div className="flex flex-col items-center">
        {loading ? (
          <CircularProgress />
        ) : !activities.isEmpty() ? (
          <div className={`w-full ${listView ? 'mb-2' : 'border-t rounded-t-md'}`}>
            <Pagination
              className={`${
                !listView ? 'mb-2 border rounded-md' : ''
              } bg-white px-4 py-3 flex items-center justify-between sm:px-6  h-14`}
              page={page}
              size={size}
              total={total}
              onPageChanged={changePage}
            />

            {listView ? (
              <div className=" flex-grow bg-white overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t('name')}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t('sub-sectors', { amount: 1 })}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">{` `}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.toJS().map((item) => (
                      <ActivityListItem
                        data={item}
                        handleClick={() => setOpenForm(true, onSelectActivity(item))}
                        handleDelete={() => setOpenDialog(true, onSelectActivity(item))}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {activities.toJS().map((sec) => (
                  <li key={sec.id} className="bg-white rounded-lg shadow flex-grow">
                    <SimpleCard data={sec} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <h4 className="text-center text-gray-600">{t('no-match-found')}</h4>
        )}
      </div>

      <ActivityForm open={openForm} handleClose={handleClose} />

      <ConfirmationDialog
        open={openDialog}
        title={`${t('delete-title', { entity: t('activities', { amount: 1 }).toLowerCase() })}`}
        message={`${t('delete-message', {
          entity: t('activities', { amount: 1 }).toLowerCase(),
          gender: 1
        })}`}
        confirmButtonLabel={t('delete')}
        handleCancel={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

Activities.propTypes = {
  activity: PropTypes.object.isRequired,
  activities: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetAllSubSectors: PropTypes.func.isRequired,
  onGetActivities: PropTypes.func.isRequired,
  onSearchActivities: PropTypes.func.isRequired,
  onSelectActivity: PropTypes.func.isRequired,
  onDeleteActivity: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const activityReducer = 'activity';

const mapStateToProps = (state) => ({
  loading: state.getIn([activityReducer, 'loading']),
  activity: state.getIn([activityReducer, 'activity']),
  activities: state.getIn([activityReducer, 'activities']),
  filters: state.getIn([activityReducer, 'filters']),
  total: state.getIn([activityReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetAllSubSectors: () => dispatch(getAllSubSectors()),
  onGetActivities: (query) => dispatch(getAllActivities(query)),
  onSearchActivities: (query) => dispatch(searchActivities(query)),
  onSelectActivity: (activity) => dispatch(selectActivity(activity)),
  onDeleteActivity: (id) => dispatch(deleteActivity(id))
});

Activities.layout = Admin;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(Activities));
