import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { Header, AppliedFilters, Pagination, ConfirmationDialog } from 'components';
import { SimpleCard, ValueChainForm, SimpleListItem, SimpleFilter } from 'containers';
import {
  getValueChains,
  searchValueChains,
  selectValueChain,
  deleteValueChain
} from 'redux/actions';
import { removeFilter } from 'utils/filtering';
import { withTranslation } from '../../../i18n';

const Admin = dynamic(() => import('layouts/Admin'), { ssr: false });

const ValueChains = ({
  valueChain,
  valueChains,
  filters,
  loading,
  onGetValueChains,
  onSearchValueChains,
  onSelectValueChain,
  onDeleteValueChain,
  total,
  t
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    onGetValueChains({ page });
    setSize(20); // TODO: Change size
  }, []);

  const parseFilterName = (filter) => {
    switch (filter) {
      case 'fullName':
        return 'Nombre';
      case 'email':
        return 'Correo';
      default:
        return '';
    }
  };

  const onSearch = (values) => {
    onSearchValueChains(values.search);
  };

  const changePage = (value) => {
    setPage(value, onGetValueChains({ page: value }));
  };

  const handleClose = () => {
    setOpenForm(false, onSelectValueChain({}));
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false, onSelectValueChain({}));
  };

  const handleDeleteConfirm = () => {
    onDeleteValueChain(valueChain.get('id'));
    onSelectValueChain({});
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
          <SimpleFilter onGetData={onGetValueChains} />
        </div>
      </Header>

      {filters ? (
        <AppliedFilters
          filters={filters.toJS()}
          parseFilterName={parseFilterName}
          onRemoveFilter={(value) => removeFilter(value, filters, onGetValueChains)}
        />
      ) : null}

      <div className="flex flex-col items-center">
        {loading ? (
          <CircularProgress />
        ) : !valueChains.isEmpty() ? (
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
                  {valueChains.toJS().map((nt) => (
                    <SimpleListItem
                      data={nt}
                      handleClick={() => setOpenForm(true, onSelectValueChain(nt))}
                      handleDelete={() => setOpenDialog(true, onSelectValueChain(nt))}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="mx-2 flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {valueChains.toJS().map((nt) => (
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

      <ValueChainForm open={openForm} handleClose={handleClose} />

      <ConfirmationDialog
        open={openDialog}
        title={`${t('delete-title', { entity: t('value-chains', { amount: 1 }).toLowerCase() })}`}
        message={`${t('delete-message', {
          entity: t('value-chains', { amount: 1 }).toLowerCase(),
          gender: 1
        })}`}
        confirmButtonLabel={t('delete')}
        handleCancel={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

ValueChains.propTypes = {
  valueChain: PropTypes.object.isRequired,
  valueChains: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetValueChains: PropTypes.func.isRequired,
  onSearchValueChains: PropTypes.func.isRequired,
  onSelectValueChain: PropTypes.func.isRequired,
  onDeleteValueChain: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const valueChainReducer = 'valueChain';

const mapStateToProps = (state) => ({
  loading: state.getIn([valueChainReducer, 'loading']),
  valueChain: state.getIn([valueChainReducer, 'valueChain']),
  valueChains: state.getIn([valueChainReducer, 'valueChains']),
  filters: state.getIn([valueChainReducer, 'filters']),
  total: state.getIn([valueChainReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetValueChains: (query) => dispatch(getValueChains(query)),
  onSearchValueChains: (query) => dispatch(searchValueChains(query)),
  onSelectValueChain: (valueChain) => dispatch(selectValueChain(valueChain)),
  onDeleteValueChain: (id) => dispatch(deleteValueChain(id))
});

ValueChains.layout = Admin;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(ValueChains));
