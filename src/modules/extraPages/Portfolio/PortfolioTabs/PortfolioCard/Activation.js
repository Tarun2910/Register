import React, {useEffect, useState} from 'react';
import {
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import IntlMessages from '@crema/helpers/IntlMessages';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import PropTypes from 'prop-types';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import {GoKey} from 'react-icons/go';

const validationSchema = yup.object({
  Activation_key: yup
    .string()
    .required(<IntlMessages id='validation.nameRequired' />),
});

const Activation = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          Activation_key: 'X4G7-K9L2-M3N8-P5Q1',
        }}
        //   validationSchema={validationSchema}
        onSubmit={(data, {setErrors, resetForm}) => {
          //   setLoading(true);
          console.log(data, 'data');
        }}
      >
        {({isSubmitting}) => (
          <Form noValidate autoComplete='off'>
            <AppTextField
              label={<IntlMessages id='common.activation_key' />}
              name='Activation_key'
              variant='outlined'
              sx={{
                width: '100%',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <GoKey />
                  </InputAdornment>
                ),
              }}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Activation;

Activation.propTypes = {};
