import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { AgentForm } from 'containers';
import { createAgent } from 'redux/actions';
import { withTranslation } from '../../../i18n';

const CreateAgent = ({ onCreateAgent, t }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState({});

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'));
  }, []);

  const handleSubmit = (values) => {
    onCreateAgent(values);
    router.push('/agents');
  };

  if (!accessToken) {
    router.push('/login');
    return null;
  }

  return (
    <AgentForm
      onSubmit={handleSubmit}
      title={`${t('new')} ${t('agents', { amount: 1 }).toLowerCase()}`}
    />
  );
};

CreateAgent.propTypes = {
  onCreateAgent: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onCreateAgent: (agent) => dispatch(createAgent(agent))
});

export default connect(null, mapDispatchToProps)(withTranslation('common')(CreateAgent));
