import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { Header, AppliedFilters, Pagination, ConfirmationDialog } from 'components';
import { SimpleCard, LegalFormForm, SimpleListItem, SimpleFilter } from 'containers';
import { getLegalForms, searchLegalForms, selectLegalForm, deleteLegalForm } from 'redux/actions';
import { removeFilter } from 'utils/filtering';
import { withTranslation } from '../../../i18n';

const Admin = dynamic(() => import('layouts/Admin'), { ssr: false });

const LegalForms = ({
  legalForm,
  legalForms,
  filters,
  loading,
  onGetLegalForms,
  onSearchLegalForms,
  onSelectLegalForm,
  onDeleteLegalForm,
  total,
  t
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    onGetLegalForms({ page });
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
    onSearchLegalForms(values.search);
  };

  const changePage = (value) => {
    setPage(value, onGetLegalForms({ page: value }));
  };

  const handleClose = () => {
    setOpenForm(false, onSelectLegalForm({}));
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false, onSelectLegalForm({}));
  };

  const handleDeleteConfirm = () => {
    onDeleteLegalForm(legalForm.get('id'));
    onSelectLegalForm({});
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
          <SimpleFilter onGetData={onGetLegalForms} />
        </div>
      </Header>

      {filters ? (
        <AppliedFilters
          filters={filters.toJS()}
          parseFilterName={parseFilterName}
          onRemoveFilter={(value) => removeFilter(value, filters, onGetLegalForms)}
        />
      ) : null}

      <div className="flex flex-col items-center">
        {loading ? (
          <CircularProgress />
        ) : !legalForms.isEmpty() ? (
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
                  {legalForms.toJS().map((item) => (
                    <SimpleListItem
                      data={item}
                      handleClick={() => setOpenForm(true, onSelectLegalForm(item))}
                      handleDelete={() => setOpenDialog(true, onSelectLegalForm(item))}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {legalForms.toJS().map((nt) => (
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

      <LegalFormForm open={openForm} handleClose={handleClose} />

      <ConfirmationDialog
        open={openDialog}
        title={`${t('delete-title', { entity: t('legal-forms', { amount: 1 }).toLowerCase() })}`}
        message={`${t('delete-message', {
          entity: t('legal-form', { amount: 1 }).toLowerCase(),
          gender: 1
        })}`}
        confirmButtonLabel={t('delete')}
        handleCancel={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

LegalForms.propTypes = {
  legalForm: PropTypes.object.isRequired,
  legalForms: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetLegalForms: PropTypes.func.isRequired,
  onSearchLegalForms: PropTypes.func.isRequired,
  onSelectLegalForm: PropTypes.func.isRequired,
  onDeleteLegalForm: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const legalFormReducer = 'legalForm';

const mapStateToProps = (state) => ({
  loading: state.getIn([legalFormReducer, 'loading']),
  legalForm: state.getIn([legalFormReducer, 'legalForm']),
  legalForms: state.getIn([legalFormReducer, 'legalForms']),
  filters: state.getIn([legalFormReducer, 'filters']),
  total: state.getIn([legalFormReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetLegalForms: (query) => dispatch(getLegalForms(query)),
  onSearchLegalForms: (query) => dispatch(searchLegalForms(query)),
  onSelectLegalForm: (legalForm) => dispatch(selectLegalForm(legalForm)),
  onDeleteLegalForm: (id) => dispatch(deleteLegalForm(id))
});

LegalForms.layout = Admin;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(LegalForms));
