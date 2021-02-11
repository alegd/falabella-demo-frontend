import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { Header, AppliedFilters, Pagination, ConfirmationDialog, Loading } from 'components';
import { AgentCard, AgentListItem, AgentsFilter } from 'containers';
import {
  getAgents,
  searchAgents,
  selectAgent,
  deleteAgent,
  getAllActivities,
  getScopes,
  getAllSectors,
  getAllSubSectors,
  getValueChains,
  getLegalForms
} from 'redux/actions';
import { withTranslation } from '../../../i18n';

const Admin = dynamic(() => import('layouts/Admin'), {
  ssr: false
});

const Agents = ({
  agents,
  filters,
  loading,
  onGetActivities,
  onGetScopes,
  onGetSectors,
  onGetSubSectors,
  onGetValueChains,
  onGetLegalForms,
  onGetAgents,
  onSearchAgents,
  onSelectAgent,
  onDeleteAgent,
  scopes,
  sectors,
  subSectors,
  total,
  t
}) => {
  const router = useRouter();
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(0);

  useEffect(() => {
    onGetActivities();
    onGetScopes();
    onGetSectors();
    onGetSubSectors();
    onGetValueChains();
    onGetLegalForms();
    onGetAgents({ page });

    setSize(20); // TODO: Change size
  }, []);

  const parseFilters = () => {
    const { activity, valueChain, legalForm, ...rest } = filters.toJS();
    const { name: activityName } = activity || {};
    const { name: valueChainName } = valueChain || {};
    const { name: legalFormName } = legalForm || {};
    return {
      activity: activityName,
      valueChain: valueChainName,
      legalForm: legalFormName,
      ...rest
    };
  };

  const parseFilterName = (filter) => {
    switch (filter) {
      case 'tradeName':
        return t('trade-name');
      case 'email':
        return t('email');
      case 'activity':
        return t('activities', { amount: 1 });
      case 'valueChain':
        return t('value-chains', { amount: 1 });
      case 'legalForm':
        return t('legal-forms', { amount: 1 });
      default:
        return '';
    }
  };

  const onSearch = (values) => {
    onSearchAgents(values.search);
  };

  const changePage = (value) => {
    setPage(value, onGetAgents({ page: value }));
  };

  const removeFilter = (value) => {
    const newFilters = Object.keys(filters.toJS())
      .filter((key) => !value.includes(key))
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: filters.toJS()[key]
        }),
        {}
      );
    onGetAgents({ filters: newFilters });
  };

  const handleDeleteCancel = () => setOpenDialog(false);

  const handleDeleteConfirm = () => {
    onDeleteAgent(selectedAgentId);
    setOpenDialog(false);
  };

  return (
    <>
      <Header
        className="mt-20"
        onSearch={onSearch}
        onViewChange={setListView}
        onCreate={() => {
          onSelectAgent({});
          router.push('/agents/create');
        }}
      >
        <div className="ml-4 py-1">
          <AgentsFilter />
        </div>
      </Header>

      {filters ? (
        <AppliedFilters
          filters={parseFilters()}
          parseFilterName={parseFilterName}
          onRemoveFilter={removeFilter}
        />
      ) : null}

      <div className="flex flex-col items-center">
        {loading ? (
          <Loading fullScreen />
        ) : !agents.isEmpty() ? (
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
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="h-14">
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                        style={{ minWidth: '12rem' }}
                      >
                        {t('trade-name')}
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        {t('municipality')}
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        {t('email')}
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        {t('activities', { amount: 2 })}
                      </th>
                      <th className="px-6 py-3 bg-gray-50">{}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agents.map((agent) => (
                      <AgentListItem
                        data={agent}
                        onUpdate={() => {
                          router.push(`/agents/edit/${agent.get('id')}`);
                          onSelectAgent(agent);
                        }}
                        onDelete={() => {
                          setSelectedAgentId(agent.get('id'));
                          setOpenDialog(true);
                        }}
                        scopes={scopes.toJS()}
                        sectors={sectors.toJS()}
                        subSectors={subSectors.toJS()}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="mx-2 flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {agents.toJS().map((agent) => (
                  <li key={agent.id} className="bg-white rounded-lg shadow flex-grow">
                    <AgentCard data={agent} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <h4 className="text-center text-gray-600">{t('no-match-found')}</h4>
        )}
      </div>

      <ConfirmationDialog
        open={openDialog}
        title={`${t('delete-title', { entity: t('agents', { amount: 1 }).toLowerCase() })}`}
        message={`${t('delete-message', {
          entity: t('agents', { amount: 1 }).toLowerCase(),
          gender: 2
        })}`}
        confirmButtonLabel={t('delete')}
        handleCancel={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

Agents.propTypes = {
  agents: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetActivities: PropTypes.func.isRequired,
  onGetScopes: PropTypes.func.isRequired,
  onGetSectors: PropTypes.func.isRequired,
  onGetSubSectors: PropTypes.func.isRequired,
  onGetValueChains: PropTypes.func.isRequired,
  onGetLegalForms: PropTypes.func.isRequired,
  onGetAgents: PropTypes.func.isRequired,
  onSearchAgents: PropTypes.func.isRequired,
  onSelectAgent: PropTypes.func.isRequired,
  onDeleteAgent: PropTypes.func.isRequired,
  scopes: PropTypes.object.isRequired,
  sectors: PropTypes.object.isRequired,
  subSectors: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const agentReducer = 'agent';
const scopeReducer = 'scope';
const sectorReducer = 'sector';
const subSectorReducer = 'subSector';

const mapStateToProps = (state) => ({
  loading: state.getIn([agentReducer, 'loading']),
  agents: state.getIn([agentReducer, 'agents']),
  scopes: state.getIn([scopeReducer, 'scopes']),
  sectors: state.getIn([sectorReducer, 'sectors']),
  subSectors: state.getIn([subSectorReducer, 'subSectors']),
  filters: state.getIn([agentReducer, 'filters']),
  total: state.getIn([agentReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetActivities: () => dispatch(getAllActivities()),
  onGetScopes: () => dispatch(getScopes()),
  onGetSectors: () => dispatch(getAllSectors()),
  onGetSubSectors: () => dispatch(getAllSubSectors()),
  onGetValueChains: () => dispatch(getValueChains()),
  onGetLegalForms: () => dispatch(getLegalForms()),
  onGetAgents: (query) => dispatch(getAgents(query)),
  onSearchAgents: (query) => dispatch(searchAgents(query)),
  onSelectAgent: (agent) => dispatch(selectAgent(agent)),
  onDeleteAgent: (id) => dispatch(deleteAgent(id))
});

Agents.layout = Admin;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(Agents));
