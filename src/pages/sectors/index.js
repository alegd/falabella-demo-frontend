import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { ConfirmationDialog, Header, AppliedFilters, Pagination } from 'components';
import { SimpleCard, SectorForm, SectorListItem, SectorsFilter } from 'containers';
import { getScopes, getAllSectors, searchSectors, selectSector, deleteSector } from 'redux/actions';
import { removeFilter } from 'utils/filtering';
import { withTranslation } from '../../../i18n';

const Admin = dynamic(() => import('layouts/Admin'), { ssr: false });

const Sectors = ({
  sector,
  sectors,
  filters,
  loading,
  onGetScopes,
  onGetSectors,
  onSearchSectors,
  onSelectSector,
  onDeleteSector,
  total,
  t
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    onGetScopes({ size: 150 });
    onGetSectors({ page });
    setSize(20); // TODO: Change size
  }, []);

  const parseFilters = () => {
    const { scope, ...rest } = filters.toJS();
    const { name: scopeName } = scope || {};
    return {
      scope: scopeName,
      ...rest
    };
  };

  const parseFilterName = (filter) => {
    switch (filter) {
      case 'name':
        return 'Nombre';
      case 'scope':
        return 'Sector';
      default:
        return '';
    }
  };

  const onSearch = (values) => {
    onSearchSectors(values.search);
  };

  const changePage = (value) => {
    setPage(value, onGetSectors({ page: value }));
  };

  const handleClose = () => {
    setOpenForm(false, onSelectSector({}));
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false, onSelectSector({}));
  };

  const handleDeleteConfirm = () => {
    onDeleteSector(sector.get('id'));
    onSelectSector({});
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
          <SectorsFilter />
        </div>
      </Header>

      {filters ? (
        <AppliedFilters
          filters={parseFilters()}
          parseFilterName={parseFilterName}
          onRemoveFilter={(value) => removeFilter(value, filters, onGetSectors)}
        />
      ) : null}

      <div className="flex flex-col items-center">
        {loading ? (
          <CircularProgress />
        ) : !sectors.isEmpty() ? (
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
                        {t('scopes', { amount: 1 })}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">{` `}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sectors.toJS().map((item) => (
                      <SectorListItem
                        data={item}
                        handleClick={() => setOpenForm(true, onSelectSector(item))}
                        handleDelete={() => setOpenDialog(true, onSelectSector(item))}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sectors.toJS().map((sec) => (
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

      <SectorForm open={openForm} handleClose={handleClose} />

      <ConfirmationDialog
        open={openDialog}
        title={`${t('delete-title', { entity: t('sectors', { amount: 1 }).toLowerCase() })}`}
        message={`${t('delete-message', {
          entity: t('sectors', { amount: 1 }).toLowerCase(),
          gender: 2
        })}`}
        confirmButtonLabel={t('delete')}
        handleCancel={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

Sectors.propTypes = {
  sector: PropTypes.object.isRequired,
  sectors: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetScopes: PropTypes.func.isRequired,
  onGetSectors: PropTypes.func.isRequired,
  onSearchSectors: PropTypes.func.isRequired,
  onSelectSector: PropTypes.func.isRequired,
  onDeleteSector: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const sectorReducer = 'sector';

const mapStateToProps = (state) => ({
  loading: state.getIn([sectorReducer, 'loading']),
  sector: state.getIn([sectorReducer, 'sector']),
  sectors: state.getIn([sectorReducer, 'sectors']),
  filters: state.getIn([sectorReducer, 'filters']),
  total: state.getIn([sectorReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetScopes: () => dispatch(getScopes()),
  onGetSectors: (query) => dispatch(getAllSectors(query)),
  onSearchSectors: (query) => dispatch(searchSectors(query)),
  onSelectSector: (sector) => dispatch(selectSector(sector)),
  onDeleteSector: (id) => dispatch(deleteSector(id))
});

Sectors.layout = Admin;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(Sectors));
