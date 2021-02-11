import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { TextInput } from 'components';
import { login } from 'redux/actions';
import Auth from 'layouts/Auth.js';
import { withTranslation } from '../../i18n';
const Login = ({ onLogin, t }) => {
  const [showPassword, setShowPassword] = useState(false);
  const initialValues = {
    username: '',
    password: '',
    rememberMe: false
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('El usuario es requerido'),
    password: Yup.string().required('La contraseña es requerida')
  });

  const onSubmit = (values) => {
    onLogin(values);
  };

  return (
    <>
      <div className="container mx-auto flex content-center items-center justify-center h-full w-full lg:w-96 pb-4">
        <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-white px-4 lg:px-10 py-6">
          <div className="flex flex-col justify-center items-center p-2">
            <a href="/">
              <img className="h-10" src="images/logo.svg" alt="Logo" />
            </a>
            <div className="text-center my-3">
              <h4 className="text-gray-700 font-bold text-lg">Inicio de sesión</h4>
              <p className="text-gray-600 mt-2">Gestión de agentes</p>
            </div>
          </div>
          <div className="flex-auto  pt-0">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form>
                <TextInput label="Usuario" name="username" type="text" />
                <TextInput
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onAction={() => setShowPassword(!showPassword)}
                  icon={
                    showPassword ? (
                      <IoMdEye size={20} className="text-gray-600" />
                    ) : (
                      <IoMdEyeOff size={20} className="text-gray-600" />
                    )
                  }
                />

                <div>
                  <label htmlFor="rememberMe" className="inline-flex items-center cursor-pointer">
                    <Field
                      id="rememberMe"
                      className="mt-1 form-checkbox text-gray-700 mr-1 w-5 h-5 ease-linear transition-all duration-150"
                      type="checkbox"
                      name="rememberMe"
                    />
                    <span className="mt-1 ml-2 text-sm font-semibold text-gray-700">
                      Recordarme
                    </span>
                  </label>
                </div>

                <button
                  className="w-full mt-6 py-3 justify-center rounded-sm px-4 bg-primary-main text-sm leading-5 font-medium text-white uppercase hover:bg-primary-light focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-300"
                  type="submit"
                >
                  {t('login')}
                </button>
              </Form>
            </Formik>
          </div>

          <div className="flex w-full mt-3 relative">
            <div className="w-1/2">
              <a href="/forgot-password" className="text-gray-700">
                <small>¿Olvidé mi contraseña?</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Login.layout = Auth;

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const mapDispatchFromProps = (dispatch) => ({
  onLogin: (credentials) => dispatch(login(credentials))
});

export default connect(null, mapDispatchFromProps)(withTranslation('common')(Login));
