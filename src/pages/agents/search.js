import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { IconContext } from 'react-icons';
import { MdViewList as ListIcon, MdApps as GridIcon } from 'react-icons/md';
import { Header, AppliedFilters, Pagination } from 'components';
import { AgentCard, AgentListItem, AgentsFilter } from 'containers';
import Clean from 'layouts/Clean';
import {
  getAgents,
  searchAgents,
  getActivities,
  getValueChains,
  getLegalForms
} from 'redux/actions';
import { withTranslation } from '../../../i18n';

const Agents = ({
  agents,
  filters,
  loading,
  onGetActivities,
  onGetValueChains,
  onGetLegalForms,
  onGetAgents,
  onSearchAgents,
  total,
  t
}) => {
  const router = useRouter();
  const [listView, setListView] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    if (agents.isEmpty()) {
      onGetActivities();
      onGetValueChains();
      onGetLegalForms();
      onGetAgents({ page });
    }

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
        return 'Nombre';
      case 'email':
        return 'Correo';
      case 'activity':
        return 'Actividad';
      case 'valueChain':
        return 'Cadena de valor';
      case 'legalForm':
        return 'Forma jurídica';
      default:
        return '';
    }
  };

  const onSearch = (values) => {
    router.push({ pathname: '/agents/search', query: { q: values.search } });
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

  return (
    <>
      <Header className="mt-20" onSearch={onSearch}>
        <div className="ml-4 py-1">
          <AgentsFilter />
        </div>

        <span className="relative z-0 inline-flex ml-4 py-1">
          <button
            type="button"
            className="w-10 relative inline-flex items-center px-2 rounded-l-md border border-gray-400 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-900 transition ease-in-out duration-150"
            onClick={() => setListView(true)}
          >
            <IconContext.Provider value={{ size: '2em' }}>
              <ListIcon />
            </IconContext.Provider>
          </button>
          <button
            type="button"
            className="-ml-px w-10 relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-400 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-900 transition ease-in-out duration-150"
            onClick={() => setListView(false)}
          >
            <IconContext.Provider value={{ size: '2em' }}>
              <GridIcon />
            </IconContext.Provider>
          </button>
        </span>
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
          <CircularProgress />
        ) : !agents.isEmpty() ? (
          <div className={`w-full ${listView ? 'shadow' : ''}`}>
            <div
              className={`${
                !listView ? 'mb-2' : ''
              } bg-white px-4 py-3 flex items-center justify-between border-gray-200 sm:px-6`}
            >
              <Pagination page={page} size={size} total={total} onPageChanged={changePage} />
            </div>

            {listView ? (
              <div className="flex-grow w-full bg-white overflow-hidden sm:rounded-md">
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
                      <AgentListItem data={agent} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="flex-grow grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
    </>
  );
};

Agents.propTypes = {
  agents: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetActivities: PropTypes.func.isRequired,
  onGetValueChains: PropTypes.func.isRequired,
  onGetLegalForms: PropTypes.func.isRequired,
  onGetAgents: PropTypes.func.isRequired,
  onSearchAgents: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.object.isRequired
};

const agentReducer = 'agent';

const mapStateToProps = (state) => ({
  loading: state.getIn([agentReducer, 'loading']),
  agents: state.getIn([agentReducer, 'agents']),
  filters: state.getIn([agentReducer, 'filters']),
  total: state.getIn([agentReducer, 'total'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetActivities: () => dispatch(getActivities()),
  onGetValueChains: () => dispatch(getValueChains()),
  onGetLegalForms: () => dispatch(getLegalForms()),
  onGetAgents: (query) => dispatch(getAgents(query)),
  onSearchAgents: (query) => dispatch(searchAgents(query))
});

Agents.layout = Clean;

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(Agents));
