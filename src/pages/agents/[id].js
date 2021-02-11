import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { CircularProgress, IconButton } from '@material-ui/core';
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { getAgent, deleteAgent } from 'redux/actions';
import Clean from 'layouts/Clean';
import { ConfirmationDialog } from 'components';
import { AgentsNavbar } from 'containers';
import { parseI18nName } from 'utils';
import { i18n, withTranslation } from '../../../i18n';

const AgentDetails = ({ agent, loading, onGetAgent, onDeleteAgent, t }) => {
  const router = useRouter();
  const [agentId, setAgentId] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('access_token'));
    const { id } = router.query || agent.get('id');
    setAgentId(id, onGetAgent(id));
  }, []);

  const handleDeleteCancel = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirm = () => {
    setOpenDialog(false, onDeleteAgent(agentId));
    router.back();
  };

  const editPath = `/agents/edit/${agentId}`;

  return (
    <>
      <AgentsNavbar title="Información del agente">
        {isAuthenticated && (
          <div className="mr-2">
            <IconButton onClick={() => router.push({ pathname: editPath, query: { id: agentId } })}>
              <EditIcon color="white" />
            </IconButton>
            <IconButton onClick={() => setOpenDialog(true)}>
              <DeleteIcon color="white" />
            </IconButton>
          </div>
        )}
      </AgentsNavbar>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="mt-20 m-4 flex flex-col md:flex-row sm:flex-row">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg flex-1 mr-0 sm:mr-4 mb-4 sm:mb-0">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('public-information')}
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-0">
              <div
                className={`${
                  agent.get('image')
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2'
                    : 'flex'
                }`}
              >
                {agent.get('image') && (
                  <div className="sm:px-6 lg:py-4 md:py-4">
                    <img
                      className="h-64"
                      src={`data:${agent.get('imageContentType')};base64, ${agent.get('image')}`}
                      alt="Agent"
                    />
                  </div>
                )}
                <div className={`${agent.get('image') ? '' : 'w-full'}`}>
                  <div
                    className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-${
                      agent.get('image') ? '1' : '3'
                    } sm:gap-4  sm:px-6 sm:py-5`}
                  >
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                      {t('trade-name')}
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                      {agent.get('tradeName')}
                    </dd>
                  </div>
                  <div
                    className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-${
                      agent.get('image') ? '1' : '3 sm:border-t sm:border-gray-200'
                    } sm:gap-4  sm:px-6 sm:py-5`}
                  >
                    <dt className="text-sm leading-5 font-medium text-gray-500">{t('email')}</dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                      {agent.get('contactEmail')}
                    </dd>
                  </div>
                  <div
                    className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-${
                      agent.get('image') ? '1' : '3 sm:border-t sm:border-gray-200'
                    } sm:gap-4  sm:px-6 sm:py-5`}
                  >
                    <dt className="text-sm leading-5 font-medium text-gray-500">{t('phone')}</dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                      {agent.get('contactPhone')}
                    </dd>
                  </div>
                </div>
              </div>
              <dl>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500 capitalize">
                    {t('web')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('web')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500 capitalize">
                    {t('web-positioning')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('webPositioning')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('municipality')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.getIn(['municipality', 'name'])}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('activities', { amount: 2 })}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2 flex flex-wrap">
                    {agent.get('scopes') &&
                      agent
                        .get('scopes')
                        .map((scope) => (
                          <div className="mr-1 mb-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                            {parseI18nName(scope.get('name'), t)}
                          </div>
                        ))}
                    {agent.get('sectors') &&
                      agent
                        .get('sectors')
                        .map((sector) => (
                          <div className="mr-1 mb-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                            {`${parseI18nName(sector.get('scopeName'), t)} / ${parseI18nName(
                              sector.get('name'),
                              t
                            )}`}
                          </div>
                        ))}
                    {agent.get('subSectors') &&
                      agent
                        .get('subSectors')
                        .map((subSector) => (
                          <div className="mr-1 mb-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                            {`${parseI18nName(subSector.get('scopeName'), t)} / ${parseI18nName(
                              subSector.get('sectorName'),
                              t
                            )} / ${parseI18nName(subSector.get('name'), t)}`}
                          </div>
                        ))}
                    {agent.get('activities') &&
                      agent
                        .get('activities')
                        .map((activity) => (
                          <div className="mr-1 mb-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                            {`${parseI18nName(activity.get('scopeName'), t)} / ${parseI18nName(
                              activity.get('sectorName'),
                              t
                            )} / ${parseI18nName(
                              activity.get('subSectorName'),
                              t
                            )} / ${parseI18nName(activity.get('name'), t)}`}
                          </div>
                        ))}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('description')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('description')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg flex-1">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('private-information')}
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-0">
              <dl>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">{t('NIF')}</dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('nif')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('business-name')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('businessName')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('value-chains', { amount: 2 })}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('valueChains') &&
                      agent
                        .get('valueChains')
                        .toJS()
                        .map((valueChain) =>
                          valueChain.name.includes('{') ? (
                            <div
                              className={` ${
                                !JSON.parse(valueChain.name)[i18n.language] && 'text-gray-400'
                              }`}
                            >
                              {parseI18nName(valueChain.name, t)}
                            </div>
                          ) : (
                            valueChain.name
                          )
                        )}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('legal-forms', { amount: 1 })}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('legalForm') && agent.getIn(['legalForm', 'name']).includes('{') ? (
                      <div
                        className={` ${
                          !JSON.parse(agent.getIn(['legalForm', 'name']))[i18n.language] &&
                          'text-gray-400'
                        }`}
                      >
                        {parseI18nName(agent.get(['legalForm', 'name']), t)}
                      </div>
                    ) : (
                      agent.getIn(['legalForm', 'name'])
                    )}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('organization')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('organization')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">{t('email')}</dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('email')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">{t('phone')}</dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('phone')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('contact-person')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('contactPerson')}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    {t('observations')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {agent.get('observations')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

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

AgentDetails.propTypes = {
  agent: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetAgent: PropTypes.func.isRequired,
  onDeleteAgent: PropTypes.func.isRequired,
  t: PropTypes.object.isRequired
};

const agentReducer = 'agent';
const scopeReducer = 'scope';
const sectorReducer = 'sector';
const subSectorReducer = 'subSector';

const mapStateToProps = (state) => ({
  loading: state.getIn([agentReducer, 'loading']),
  agent: state.getIn([agentReducer, 'agent']),
  scopes: state.getIn([scopeReducer, 'scopes']),
  sectors: state.getIn([sectorReducer, 'sectors']),
  subSectors: state.getIn([subSectorReducer, 'subSectors'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetAgent: (id) => dispatch(getAgent(id)),
  onDeleteAgent: (id) => dispatch(deleteAgent(id))
});

AgentDetails.layout = Clean;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('common')(AgentDetails));

export async function getServerSideProps() {
  return {
    props: {} // will be passed to the page component as props
  };
}
