import React, {useState} from 'react';
import Button from '@mui/material/Button';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {Link} from 'react-router-dom';
import AppInfoView from '@crema/components/AppInfoView';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IntlMessages from '@crema/helpers/IntlMessages';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import {Fonts} from '@crema/constants/AppEnums';
import AuthWrapper from 'modules/auth/AuthWrapper';
import Basic from './upload';
import PropTypes from 'prop-types';

const validationSchema = yup.object({
  host: yup.string().required(<IntlMessages id='validation.hostRequired' />),
  port: yup.string().required(<IntlMessages id='validation.portRequired' />),
  userid: yup
    .string()
    .required(<IntlMessages id='validation.useridRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const ForgetPasswordJwtAuth = ({checked, setChecked, handleChange}) => {
  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <Formik
          validateOnChange={true}
          initialValues={{
            host: '',
            port: '',
            ssl: '',
            userid: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(data, {setSubmitting, resetForm}) => {
            setSubmitting(true);
            //reset password api goes here
            setSubmitting(false);
            resetForm();
          }}
        >
          {({isSubmitting}) => (
            <Form style={{textAlign: 'left'}}>
              <Box sx={{mb: {xs: 5, lg: 8}}}>
                <AppTextField
                  placeholder='Host'
                  name='host'
                  label={<IntlMessages id='common.host' />}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                  variant='outlined'
                />
              </Box>
              <Box sx={{mb: {xs: 5, lg: 8}}}>
                <AppTextField
                  placeholder='Port'
                  name='port'
                  label={<IntlMessages id='common.port' />}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                  variant='outlined'
                />
              </Box>

              {checked && (
                <Box sx={{mb: {xs: 5, lg: 8}}}>
                  <Basic />
                </Box>
              )}
              <Box sx={{mb: {xs: 5, lg: 8}}}>
                <AppTextField
                  placeholder='userId'
                  name='userid'
                  label={<IntlMessages id='common.userid' />}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                  variant='outlined'
                />
              </Box>
              <Box sx={{mb: {xs: 5, lg: 8}}}>
                <AppTextField
                  placeholder='Password'
                  name='password'
                  label={<IntlMessages id='common.password' />}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                  variant='outlined'
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Box>

      <AppInfoView />
    </Box>
  );
};

export default ForgetPasswordJwtAuth;

ForgetPasswordJwtAuth.propTypes = {
  setChecked: PropTypes.any,
  checked: PropTypes.any,
  handleChange: PropTypes.any,
};
