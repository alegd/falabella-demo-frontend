import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { Header, AppliedFilters, Pagination, ConfirmationDialog } from 'components';
import { SimpleCard, ScopeForm, SimpleListItem, SimpleFilter } from 'containers';
import { getScopes, searchScopes, selectScope, deleteScope } from 'redux/actions';
import { removeFilter } from 'utils/filtering';
import { withTranslation } from '../../../i18n';

const Admin = dynamic(() => import('layouts/Admin'), { ssr: false });

const Scopes = ({
  scope,
  scopes,
  filters,
  loading,
  onGetScopes,
  onSearchScopes,
  onSelectScope,
  onDeleteScope,
  total,
  t
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    onGetScopes({ page });
    setSize(20); // TODO: Change size
  }, []);

  const parseFilterName = (filter) => {
    switch (filter) {
      case 'name':
        return 'Nombre';
      default:
        return '';
    }
  };

  const onSearch = (values) => {
    onSearchScopes(values.search);
  };

  const changePage = (value) => {
    setPage(value, onGetScopes({ page: value }));
  };

  const handleClose = () => {
    setOpenForm(false, onSelectScope({}));
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false, onSelectScope({}));
  };

  const handleDeleteConfirm = () => {
    onDeleteScope(scope.get('id'));
    onSelectScope({});
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
          <SimpleFilter onGetData={onGetScopes} />
        </div>
      </Header>

      {filters ? (
        <AppliedFilters
          filters={filters.toJS()}
          parseFilterName={parseFilterName}
          onRemoveFilter={(value) => removeFilter(value, filters, onGetScopes)}
        />
      ) : null}

      <div className="flex flex-col items-center">
        {loading ? (
          <CircularProgress />
        ) : !scopes.isEmpty() ? (
          <div className={`w-full ${listView ? 'shadow' : ''}`}>
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
                <ul>
                  {scopes.toJS().map((item, index) => (
                    <>
                      <SimpleListItem
                        data={item}
                        handleClick={() => setOpenForm(true, onSelectScope(item))}
                        handleDelete={() => setOpenDialog(true, onSelectScope(item))}
                      />
                      {index === scopes.length - 1 ? (
                        <div className="border-t border-gray-200" />
                      ) : null}
                    </>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="mx-2 flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {scopes.toJS().map((nt) => (
                  <li key={nt.id} className="bg-white rounded-lg shadow flex-grow">
                    <SimpleCard data={nt} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <h4 className="text-center text-gray-600">{t('no-match-found')}</h4>
        )}
      </div>

      <ScopeForm open={openForm} handleClose={handleClose} />

      <ConfirmationDialog
        open={openDialog}
        title={`${t('delete-title', { entity: t('scopes', { amount: 1 }).toLowerCase() })}`}
        message={`${t('delete-message', {
          entity: t('scopes', { amount: 1 }).toLowerCase(),
          gender: 2
        })}`}
        confirmButtonLabel={t('delete')}
        handleCancel={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

Scopes.propTypes = {
  scope: PropTypes.object.isRequired,
  scopes: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetScopes: PropTypes.func.isRequired,
  onSearchScopes: PropTypes.func.isRequired,
  onSelectScope: PropTypes.func.isRequired,
  onDeleteScope: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const scopeReducer = 'scope';

const mapStateToProps = (state) => ({
  loading: state.getIn([scopeReducer, 'loading']),
  scope: state.getIn([scopeReducer, 'scope']),
  scopes: state.getIn([scopeReducer, 'scopes']),
  filters: state.getIn([scopeReducer, 'filters']),
  total: state.getIn([scopeReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetScopes: (query) => dispatch(getScopes(query)),
  onSearchScopes: (query) => dispatch(searchScopes(query)),
  onSelectScope: (scope) => dispatch(selectScope(scope)),
  onDeleteScope: (id) => dispatch(deleteScope(id))
});

Scopes.layout = Admin;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(Scopes));
