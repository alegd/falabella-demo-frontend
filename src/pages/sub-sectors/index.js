import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { ConfirmationDialog, Header, AppliedFilters, Pagination } from 'components';
import { SimpleCard, SubSectorForm, SubSectorListItem, SubSectorsFilter } from 'containers';
import {
  getAllSectors,
  getAllSubSectors,
  searchSubSectors,
  selectSubSector,
  deleteSubSector
} from 'redux/actions';
import { removeFilter } from 'utils/filtering';
import { withTranslation } from '../../../i18n';

const Admin = dynamic(() => import('layouts/Admin'), { ssr: false });

const SubSectors = ({
  subSector,
  subSectors,
  filters,
  loading,
  onGetSectors,
  onGetSubSectors,
  onSearchSubSectors,
  onSelectSubSector,
  onDeleteSubSector,
  total,
  t
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    onGetSectors({ size: 150 });
    onGetSubSectors({ page });
    setSize(20); // TODO: Change size
  }, []);

  const parseFilters = () => {
    const { sector, ...rest } = filters.toJS();
    const { name: sectorName } = sector || {};
    return {
      sector: sectorName,
      ...rest
    };
  };

  const parseFilterName = (filter) => {
    switch (filter) {
      case 'name':
        return 'Nombre';
      case 'sector':
        return 'Sector';
      default:
        return '';
    }
  };

  const onSearch = (values) => {
    onSearchSubSectors(values.search);
  };

  const changePage = (value) => {
    setPage(value, onGetSubSectors({ page: value }));
  };

  const handleClose = () => {
    setOpenForm(false, onSelectSubSector({}));
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false, onSelectSubSector({}));
  };

  const handleDeleteConfirm = () => {
    onDeleteSubSector(subSector.get('id'));
    onSelectSubSector({});
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
          <SubSectorsFilter />
        </div>
      </Header>

      {filters ? (
        <AppliedFilters
          filters={parseFilters()}
          parseFilterName={parseFilterName}
          onRemoveFilter={(value) => removeFilter(value, filters, onGetSubSectors)}
        />
      ) : null}

      <div className="flex flex-col items-center">
        {loading ? (
          <CircularProgress />
        ) : !subSectors.isEmpty() ? (
          <div className={`w-full ${listView ? 'shadow mb-2 border rounded-md' : ''}`}>
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
                        {t('sectors', { amount: 1 })}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">{` `}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subSectors.toJS().map((item) => (
                      <SubSectorListItem
                        data={item}
                        handleClick={() => setOpenForm(true, onSelectSubSector(item))}
                        handleDelete={() => setOpenDialog(true, onSelectSubSector(item))}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {subSectors.toJS().map((subSec) => (
                  <li key={subSec.id} className="bg-white rounded-lg shadow flex-grow">
                    <SimpleCard data={subSec} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <h4 className="text-center text-gray-600">{t('no-match-found')}</h4>
        )}
      </div>

      <SubSectorForm open={openForm} handleClose={handleClose} />

      <ConfirmationDialog
        open={openDialog}
        title={`${t('delete-title', { entity: t('sub-sectors', { amount: 1 }).toLowerCase() })}`}
        message={`${t('delete-message', {
          entity: t('sub-sectors', { amount: 1 }).toLowerCase(),
          gender: 2
        })}`}
        confirmButtonLabel={t('delete')}
        handleCancel={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

SubSectors.propTypes = {
  subSector: PropTypes.object.isRequired,
  subSectors: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetSectors: PropTypes.func.isRequired,
  onGetSubSectors: PropTypes.func.isRequired,
  onSearchSubSectors: PropTypes.func.isRequired,
  onSelectSubSector: PropTypes.func.isRequired,
  onDeleteSubSector: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const subSectorReducer = 'subSector';

const mapStateToProps = (state) => ({
  loading: state.getIn([subSectorReducer, 'loading']),
  subSector: state.getIn([subSectorReducer, 'subSector']),
  subSectors: state.getIn([subSectorReducer, 'subSectors']),
  filters: state.getIn([subSectorReducer, 'filters']),
  total: state.getIn([subSectorReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetSectors: (query) => dispatch(getAllSectors(query)),
  onGetSubSectors: (query) => dispatch(getAllSubSectors(query)),
  onSearchSubSectors: (query) => dispatch(searchSubSectors(query)),
  onSelectSubSector: (subSector) => dispatch(selectSubSector(subSector)),
  onDeleteSubSector: (id) => dispatch(deleteSubSector(id))
});

SubSectors.layout = Admin;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(SubSectors));
