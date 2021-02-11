/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MdRemoveCircleOutline as RemoveIcon } from 'react-icons/md';
import { getMunicipalities, getValueChains, getLegalForms } from 'redux/actions';
import { Loading, DropZone, TextInput, SelectInput } from 'components';
import { parseI18nName } from 'utils';
import AgentsNavbar from './AgentsNavbar';
import ActivitySelector from './ActivitySelector';
import { withTranslation } from '../../../i18n';

const AgentForm = ({
  municipalities,
  valueChains,
  agent,
  legalForms,
  loadingAgent,
  loadingMunicipalities,
  onSubmit,
  onGetMunicipalities,
  onGetValueChains,
  onGetLegalForms,
  title,
  t
}) => {
  const router = useRouter();
  const { id } = router.query;
  const isNewAgent = !id;

  useEffect(() => {
    onGetMunicipalities({ size: 4 });
    onGetValueChains({ size: 200 });
    onGetLegalForms({ size: 200 });
  }, []);

  const initialValues = {
    activities: [],
    businessName: '',
    contactEmail: '',
    contactPerson: '',
    contactPhone: '',
    description: '',
    email: '',
    webPositioning: '',
    image: '',
    imageContentType: '',
    imageUrl: '',
    legalForm: '',
    municipality: '',
    nif: '',
    observations: '',
    organization: '',
    phone: '',
    scopes: [],
    sectors: [],
    subSectors: [],
    tradeName: '',
    valueChains: [],
    web: ''
  };

  const validationSchema = Yup.object().shape({
    tradeName: Yup.string().required(t('field-required', { field: t('name') })),
    description: Yup.string().required(t('field-required', { field: t('description') })),
    municipality: Yup.object().required(t('field-required', { field: t('municipality') })),
    email: Yup.string()
      .email('Invalid email')
      .required(t('field-required', { field: t('email') })),
    contactPerson: Yup.string().required(t('field-required', { field: t('contact-person') }))
  });

  return (
    <>
      <AgentsNavbar title={title} />

      {(loadingAgent || loadingMunicipalities) && <Loading fullScreen />}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ setFieldValue }) => {
          const [tag, setTag] = useState('');
          const [agentScopes, setAgentScopes] = useState([]);
          const [agentSectors, setAgentSectors] = useState([]);
          const [agentSubSectors, setAgentSubSectors] = useState([]);
          const [agentActivities, setAgentActivities] = useState([]);
          const [tempTags, setTempTags] = useState([]);
          const agentImage = !isNewAgent
            ? [`data:${agent?.get('imageContentType')};base64,${agent?.get('image')}`]
            : [];

          const onImageChange = (img) => {
            if (img.length > 0) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const fileData = reader.result.split(/;|,/);
                setFieldValue('image', fileData[2]);
                setFieldValue('imageContentType', fileData[0].split(':')[1]);
                setFieldValue('imageUrl', img[0].path);
              };
              reader.readAsDataURL(img[0]);
            } else {
              setFieldValue('image', '');
              setFieldValue('imageContentType', '');
              setFieldValue('imageUrl', '');
            }
          };

          useEffect(() => {
            if (!isNewAgent) {
              Object.keys(initialValues).forEach((field) => {
                setFieldValue(field, agent?.toJS()[field], false);
              });

              const tags = [];
              if (agent?.get('scopes')?.toJS().length > 0)
                agent
                  .get('scopes')
                  .toJS()
                  .forEach((a) => tags.push(a));
              if (agent?.get('sectors')?.toJS().length > 0)
                agent
                  .get('sectors')
                  .toJS()
                  .forEach((a) => tags.push(a));
              if (agent?.get('subSectors')?.toJS().length > 0)
                agent
                  .get('subSectors')
                  .toJS()
                  .forEach((a) => tags.push(a));
              if (agent?.get('activities')?.toJS().length > 0)
                agent
                  .get('activities')
                  .toJS()
                  .forEach((a) => tags.push(a));
              setTempTags(tags);
            }
          }, []);

          const addTag = () => {
            if (tag) {
              const value = tag[tag.length - 1];
              switch (value.type) {
                case 'scope':
                  setAgentScopes(
                    [...agentScopes, value],
                    setFieldValue('scopes', [...agentScopes, value])
                  );
                  break;
                case 'sector':
                  setAgentSectors(
                    [...agentSectors, value],
                    setFieldValue('sectors', [...agentSectors, value])
                  );
                  break;
                case 'sub-sector':
                  setAgentSubSectors(
                    [...agentSubSectors, value],
                    setFieldValue('subSectors', [...agentSectors, value])
                  );
                  break;
                default:
                  setAgentActivities(
                    [...agentActivities, value],
                    setFieldValue('activities', [...agentActivities, value])
                  );
                  break;
              }

              setTempTags([...tempTags, value]);
              setTag(null);
            }
          };

          const onTagChange = (value) => {
            setTag(value);
          };

          const removeActivity = (value) => {
            switch (value.length) {
              case 2:
                const filteredScopes = agentScopes.filter((scope) => scope.name !== value.name);
                setAgentScopes(filteredScopes, setFieldValue('scopes', filteredScopes));
                break;
              case 4:
                const filteredSectors = agentSectors.filter((sec) => sec.name !== value.name);
                setAgentSectors(filteredSectors, setFieldValue('sectors', filteredSectors));
                break;
              case 6:
                const filteredSubSectors = agentSubSectors.filter(
                  (subSec) => subSec.name !== value.name
                );
                setAgentSubSectors(
                  filteredSubSectors,
                  setFieldValue('subSectors', filteredSubSectors)
                );
                break;
              default:
                const filteredActivities = agentActivities.filter(
                  (activities) => activities.name !== value.name
                );
                setAgentActivities(
                  filteredActivities,
                  setFieldValue('activities', filteredActivities)
                );
                break;
            }

            const filteredTags = tempTags.filter((tempTag) => tempTag.name !== value.name);
            setTempTags(filteredTags);
            setTag(filteredTags);
          };

          return (
            <Form className="bg-gray-50" style={{ marginTop: 56 }}>
              <div className="p-8 mx-2 space-y-6">
                <div className="bg-white py-5 px-10 rounded shadow-md">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    {t('public-information')}
                  </h3>
                  <div className="flex ">
                    <div className="flex flex-col w-1/2 mr-8">
                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput label={t('trade-name')} name="tradeName" type="text" required />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput label={t('email')} name="contactEmail" type="email" />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput label={t('phone')} name="contactPhone" type="text" />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput label="Web" name="web" type="text" />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput label={t('web-positioning')} name="webPositioning" type="text" />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center mt-1">
                        <SelectInput
                          name="municipality"
                          label={t('municipality')}
                          options={municipalities.toJS()}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col w-1/2">
                      <div className="-mb-4 bg-white p-2 z-10 w-24 mx-2">
                        {t('activities', { amount: 2 })}
                      </div>
                      <div className="border-gray-300 border p-4 px-4 rounded-md">
                        <div className="mt-1 mb-3 flex flex-col space-y-4 rounded-md">
                          <ActivitySelector
                            name="activities"
                            fieldName="activities"
                            onTagChange={(value) => onTagChange(value)}
                            onAddTag={addTag}
                          />
                        </div>
                        {tempTags && tempTags.length > 0 ? (
                          <div className="border-dashed border-2 border-gray-300 p-3 mb-3 bg-gray-50">
                            {tempTags.map((tg, index) => (
                              <div
                                key={tg.id}
                                className={`flex flex-grow items-center justify-between ${
                                  index < tempTags.length - 1
                                    ? 'border-b border-gray-200 mb-2 pb-2'
                                    : ''
                                }`}
                              >
                                <div className="text-sm font-medium text-gray-800">
                                  {tg &&
                                    Object.entries(tg)
                                      .reverse()
                                      .map(([key, value], idx) =>
                                        key.toString().toLowerCase().includes('name')
                                          ? `${parseI18nName(value, t)}${
                                              idx !== Object.entries(tg).length - 2 ? ' / ' : ''
                                            }`
                                          : null
                                      )}
                                </div>
                                <button
                                  className="hover:text-red-600 "
                                  type="button"
                                  onClick={() => removeActivity(tg)}
                                >
                                  <RemoveIcon size={20} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-2">
                    <div className="w-1/2">
                      <TextInput
                        name="description"
                        label={t('description')}
                        type="textarea"
                        required
                      />
                    </div>

                    <div className="w-1/2 ml-8 mt-10">
                      <DropZone
                        dropzoneText={t('drop-zone-text')}
                        onChange={onImageChange}
                        filesLimit={1}
                        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                        initialFiles={agentImage}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white py-5 px-10 rounded shadow-md">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    {t('private-information')}
                  </h3>
                  <div className="flex ">
                    <div className="flex flex-col w-1/2 mr-8">
                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput name="nif" label="NIF" type="text" />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput name="businessName" label="Razón Social" type="text" />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center mb-3">
                        <SelectInput
                          name="valueChains"
                          label={t('value-chains', { amount: 1 })}
                          options={valueChains.toJS()}
                          isMulti
                        />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center mb-3">
                        <SelectInput
                          name="legalForm"
                          label={t('legal-forms', { amount: 1 })}
                          options={legalForms.toJS()}
                        />
                      </div>

                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput name="organization" label={t('organization')} type="text" />
                      </div>
                    </div>

                    <div className="flex flex-col w-1/2">
                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput label={t('email')} name="email" type="email" required />
                      </div>
                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput label={t('phone')} name="phone" type="text" />
                      </div>
                      <div className="flex space-x-2 w-3/4 items-center">
                        <TextInput
                          label={t('contact-person')}
                          name="contactPerson"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <TextInput name="observations" label={t('observations')} type="textarea" />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="py-2 px-4 border border-gray-300 rounded-sm text-sm leading-5 font-medium text-gray-700 uppercase hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-300 ease-in-out mr-4"
                      onClick={() => router.back()}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex ml-4 py-2 justify-center rounded-sm px-4 bg-primary-main text-sm leading-5 font-medium text-white uppercase hover:bg-white hover:text-primary focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-300"
                    >
                      {t('save')}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

AgentForm.defaultProps = {
  title: ''
};

AgentForm.propTypes = {
  valueChains: PropTypes.object.isRequired,
  agent: PropTypes.object.isRequired,
  legalForms: PropTypes.object.isRequired,
  loadingAgent: PropTypes.bool.isRequired,
  loadingMunicipalities: PropTypes.bool.isRequired,
  municipalities: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGetValueChains: PropTypes.func.isRequired,
  onGetLegalForms: PropTypes.func.isRequired,
  onGetMunicipalities: PropTypes.func.isRequired,
  title: PropTypes.string,
  t: PropTypes.func.isRequired
};

const agentReducer = 'agent';
const municipalityReducer = 'municipality';
const valueChainReducer = 'valueChain';
const legalFormReducer = 'legalForm';
const scopeReducer = 'scope';
const sectorReducer = 'sector';
const subSectorReducer = 'subSector';

const mapStateToProps = (state) => ({
  agent: state.getIn([agentReducer, 'agent']),
  loadingAgent: state.getIn([agentReducer, 'loading']),
  municipalities: state.getIn([municipalityReducer, 'municipalities']),
  loadingMunicipalities: state.getIn([municipalityReducer, 'loading']),
  valueChains: state.getIn([valueChainReducer, 'valueChains']),
  legalForms: state.getIn([legalFormReducer, 'legalForms']),
  scopes: state.getIn([scopeReducer, 'scopes']),
  sectors: state.getIn([sectorReducer, 'sectors']),
  subSectors: state.getIn([subSectorReducer, 'subSectors'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetMunicipalities: () => dispatch(getMunicipalities()),
  onGetValueChains: () => dispatch(getValueChains()),
  onGetLegalForms: () => dispatch(getLegalForms())
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(AgentForm));
