import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Transition } from '@headlessui/react';
import { Formik, Form } from 'formik';
import { getAllSubSectors } from 'redux/actions';
import { TextInput, SelectInput } from 'components';
import { withTranslation } from '../../../i18n';

const SubSectorsFilter = ({ sectors, onGetSubSectors, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialValues = {
    name: '',
    sector: ''
  };

  const handleFilter = (values) => {
    onGetSubSectors({ filters: values });
    setIsOpen(false);
  };

  return (
    <>
      <div>
        <span className="rounded-full shadow-sm">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            id="options-menu"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded="true"
          >
            {t('filter')}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {(ref) => (
          <div ref={ref} className="origin-top-right absolute  mt-2 w-56 rounded-md shadow-lg">
            <div className="rounded-md bg-white shadow-xs">
              <div
                className="p-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <Formik initialValues={initialValues} onSubmit={handleFilter}>
                  <Form>
                    <TextInput label="Nombre" name="name" type="text" />
                    <SelectInput label="Sector" name="sector" options={sectors.toJS()} />

                    <span className="flex justify-end rounded-md shadow-sm">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 mt-2 text-base leading-6 font-medium rounded-md text-white bg-primary-main hover:bg-primary-light hover:text-grey-600 focus:outline-none focus:shadow-outline-indigo transition ease-in-out duration-150"
                      >
                        {t('filter')}
                      </button>
                    </span>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

SubSectorsFilter.propTypes = {
  sectors: PropTypes.object.isRequired,
  onGetSubSectors: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const sectorReducer = 'sector';

const mapStateToProps = (state) => ({
  sectors: state.getIn([sectorReducer, 'sectors'])
});

const mapDispatchToProps = (dispatch) => ({
  onGetSubSectors: (query) => dispatch(getAllSubSectors(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('common')(SubSectorsFilter));
