import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import {Typography, useTheme} from '@mui/material';
import {Fonts} from '@crema/constants/AppEnums';
import AppAnimate from '@crema/components/AppAnimate';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import {ReactComponent as Logo} from '../../../assets/user/forgot-password.svg';
import Arc from '../../../assets/user/arcTeam.png';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';

const validationSchema = yup.object({
  email: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
});

const ForgetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const NavigateSignin = () => {
    navigate('/signin');
  };
  return (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <Box
        sx={{
          pb: 6,
          py: {xl: 8},
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            maxWidth: 1024,
            width: '100%',
            padding: 8,
            paddingLeft: {xs: 8, md: 2},
            overflow: 'hidden',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

            //
            background: 'rgba(255, 255, 255, 0.6)',

            WebkitBackdropFilter: ' blur(4px)',
            backdropFilter: 'blur(4px)',

            // borderRadius: '0.4rem',
          }}
        >
          <Grid
            container
            spacing={5}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  '& svg': {
                    width: '100%',
                    height: '100%',
                    display: 'inline-block',
                    paddingRight: {xs: 0, lg: 10},
                  },
                }}
              >
                {/* <Logo fill={theme.palette.primary.main} /> */}
                <img
                  style={{maxWidth: '75%', marginBottom: '10px'}}
                  src={Arc}
                />
              </Box>
            </Grid>

            {/* <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  p: {xs: 8, lg: 12},
                  px: {xl: 16},
                  py: {xl: 12},
                }}
              >
                <Box
                  sx={{
                    mb: {xs: 4, xl: 8},
                    fontWeight: Fonts.BOLD,
                    fontSize: 20,
                  }}
                >
                  <IntlMessages id='common.forgetPassword' />
                </Box>
                <Box sx={{mb: 5, fontSize: 14}}>
                  <Typography component='p'>
                    <IntlMessages id='common.forgetPasswordTextOne' />
                  </Typography>
                  <Typography component='p'>
                    <IntlMessages id='common.forgetPasswordTextTwo' />
                  </Typography>
                </Box>
                <Formik
                  validateOnChange={true}
                  initialValues={{
                    email: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(data, {setSubmitting, resetForm}) => {
                    setSubmitting(true);
                    setSubmitting(false);
                    resetForm();
                  }}
                >
                  {({isSubmitting}) => (
                    <Form
                      sx={{
                        textAlign: 'left',
                      }}
                    >
                      <Box sx={{mb: {xs: 3, xl: 4}}}>
                        <AppTextField
                          name='email'
                          label={<IntlMessages id='common.emailAddress' />}
                          sx={{
                            width: '100%',
                          }}
                          variant='outlined'
                        />
                      </Box>

                      <Button
                        variant='contained'
                        color='primary'
                        disabled={isSubmitting}
                        sx={{
                          width: '100%',
                          height: 44,
                        }}
                        type='submit'
                      >
                        Send password
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Grid> */}

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  mb: {xs: 5, xl: 8},
                  fontWeight: Fonts.BOLD,
                  fontSize: 20,
                }}
              >
                <IntlMessages id='common.forgetPassword' />
              </Box>
              <Box sx={{mb: 5, fontSize: 14}}>
                <Typography component='p'>
                  <IntlMessages id='common.forgetPasswordTextOne' />
                </Typography>
                {/* <Typography component='p'>
                  <IntlMessages id='common.forgetPasswordTextTwo' />
                </Typography> */}
              </Box>
              <Formik
                validateOnChange={true}
                initialValues={{
                  email: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(data, {setSubmitting, resetForm}) => {
                  resetForm();

                  let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/public/sendPasswordResetMail`,
                    headers: {email: data.email},
                  };

                  axios
                    .request(config)
                    .then((response) => {
                      console.log(JSON.stringify(response.data));
                      // setLoading(false);
                      sessionStorage.setItem(
                        'token',
                        response.data.access_token,
                      );
                      toast.success('Mail send successfully');
                    })
                    .catch((error) => {
                      // setLoading(false);
                      toast.error(error?.response?.data?.error);
                      console.log(error);
                    });
                }}
              >
                {({isSubmitting}) => (
                  <Form
                    sx={{
                      textAlign: 'left',
                    }}
                  >
                    <Box sx={{mb: {xs: 3, xl: 4}}}>
                      <AppTextField
                        name='email'
                        label={<IntlMessages id='common.emailAddress' />}
                        sx={{
                          width: '100%',
                        }}
                        variant='outlined'
                      />
                    </Box>

                    <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: {sm: 'center'},
                      }}
                    >
                      <Box
                        component='span'
                        sx={{
                          cursor: 'pointer',
                          ml: {xs: 0, sm: 'auto'},
                          mt: {xs: 2, sm: 0},
                          color: 'primary.main',
                          fontWeight: Fonts.BOLD,
                          fontSize: 14,
                        }}
                        onClick={NavigateSignin}
                      >
                        Sign In?
                      </Box>
                    </Box>

                    <Button
                      variant='contained'
                      color='primary'
                      disabled={isSubmitting}
                      sx={{
                        width: '100%',
                        height: 44,
                      }}
                      type='submit'
                    >
                      Send
                    </Button>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default ForgetPassword;
