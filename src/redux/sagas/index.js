import { all } from 'redux-saga/effects';
import activitySaga from './activitySaga';
import agentSaga from './agentSaga';
import authSaga from './authSaga';
import legalFormSaga from './legalFormSaga';
import municipalitySaga from './municipalitySaga';
import scopeSaga from './scopeSaga';
import sectorSaga from './sectorSaga';
import subSectorSaga from './subSectorSaga';
import valueChainSaga from './valueChainSaga';

export default function* rootSaga() {
  yield all([
    activitySaga(),
    agentSaga(),
    authSaga(),
    legalFormSaga(),
    municipalitySaga(),
    scopeSaga(),
    sectorSaga(),
    subSectorSaga(),
    valueChainSaga()
  ]);
}
