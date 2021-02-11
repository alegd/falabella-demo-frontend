import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { TextInput } from 'components';
import { forgotPassword } from 'redux/actions';
import * as Yup from 'yup';
import Auth from 'layouts/Auth.js';

const ForgotPassword = ({ onForgotPassword }) => {
  const initialValues = {
    email: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Correo electrónico no válido').required('El correo es requerido.')
  });

  const onSubmit = (values) => {
    onForgotPassword(values);
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
              <h5 className="text-gray-600 font-bold">Restablecer mi contraseña</h5>
            </div>
          </div>
          <p className="p-3 mb-3 bg-blue-200 rounded-md border border-blue-400 text-sm text-blue-800">
            Introduzca la dirección de correo electrónico que utilizó para registrarse
          </p>
          <div className="flex-auto  pt-0">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form>
                <div className="relative w-full mb-3">
                  <TextInput
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                  />
                </div>

                <div className="text-center mt-6 mb-4">
                  <button
                    className="w-full py-2 justify-center rounded-sm px-4 bg-blue-600 text-sm leading-5 font-medium text-white uppercase hover:bg-blue-800 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-300"
                    type="submit"
                  >
                    Restablecer la contraseña
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

ForgotPassword.layout = Auth;

ForgotPassword.propTypes = {
  onForgotPassword: PropTypes.func.isRequired
};

const mapDispatchFromProps = (dispatch) => ({
  onForgotPassword: (email) => dispatch(forgotPassword(email))
});

export default connect(null, mapDispatchFromProps)(ForgotPassword);
