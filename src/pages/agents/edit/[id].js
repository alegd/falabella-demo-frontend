import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { AgentForm } from 'containers';
import { getAgent, updateAgent } from 'redux/actions';
import { withTranslation } from '../../../../i18n';

const EditAgent = ({ agent, loadingAgent, onGetAgent, onUpdateAgent, t }) => {
  const router = useRouter();
  const [agentId, setAgentId] = useState();
  const [accessToken, setAccessToken] = useState({});

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'));
    const { id } = router.query || agent.get('id');
    setAgentId(id, onGetAgent(id));
  }, []);

  const handleSubmit = async (values) => {
    const e = values;
    e.id = agentId;
    await onUpdateAgent(e);
    onGetAgent(agent);
    router.push('/agents');
  };

  if (!accessToken) {
    router.push('/login');
    return null;
  }

  return (
    <>
      {!loadingAgent && (
        <AgentForm
          onSubmit={handleSubmit}
          title={`${t('update')} ${t('agents', { amount: 1 }).toLowerCase()}`}
        />
      )}
    </>
  );
};

EditAgent.propTypes = {
  agent: PropTypes.object.isRequired,
  loadingAgent: PropTypes.bool.isRequired,
  onGetAgent: PropTypes.func.isRequired,
  onUpdateAgent: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const agentReducer = 'agent';

const mapStateToProps = (state) => ({
  agent: state.getIn([agentReducer, 'agent']),
  loadingAgent: state.getIn([agentReducer, 'loading'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetAgent: (agent) => dispatch(getAgent(agent)),
  onUpdateAgent: (agent) => dispatch(updateAgent(agent))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(EditAgent));
