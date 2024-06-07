import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import {
  Checkbox,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import IntlMessages from '@crema/helpers/IntlMessages';
import {useIntl} from 'react-intl';
import Box from '@mui/material/Box';
import {grey} from '@mui/material/colors';
import {Fonts} from '@crema/constants/AppEnums';
import AppAnimate from '@crema/components/AppAnimate';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
// import {ReactComponent as Logo} from '../../../assets/user/cipher-guard021.svg';
import pic from '../../../assets/user/access-arc-05.png';
import teamsync from '../../../assets/user/teamsync.png';
import Arc from '../../../assets/user/arcTeam.png';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useAuthMethod} from '@crema/hooks/AuthHooks';
import axios from 'axios';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import {toast} from 'react-toastify';

const validationSchema = yup.object({
  setpassword: yup
    .string()
    // .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.passwordRequired' />),
  confirmpassword: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const Verifed = () => {
  const theme = useTheme();
  const {messages} = useIntl();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmshowPassword, setConfirmShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const {token} = useParams();

  console.log(token);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleComfirmPasswordVisibility = () => {
    setConfirmShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const NavigateTosignin = () => {
    navigate('/signin');
  };

  const SendMail = () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/public/sendTokenAgain`,
      headers: {email: sessionStorage.getItem('AdminEmail')},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setLoading(false);
        toast.success('Mail send Successfully');
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
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
            <Grid
              item
              xs={12}
              md={6}
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
              <img style={{maxWidth: '75%'}} src={Arc} />
            </Grid>
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
                {/* <IntlMessages id='common.verify' /> */}
                Reset Your Password
              </Box>
              <Box
                sx={{
                  mb: {xs: 5, xl: 8},
                  fontWeight: Fonts.MEDIUM,
                  fontSize: 15,
                }}
              >
                {/* <IntlMessages id='common.verifymsg' /> */}
                <Formik
                  initialValues={{
                    setpassword: '',
                    confirmpassword: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(data, {setErrors, resetForm}) => {
                    console.log(data, 'data');

                    setLoading(true);
                    if (data.setpassword !== data.confirmpassword) {
                      setLoading(false);
                      setErrors({
                        confirmpassword: (
                          <IntlMessages id='validation.passwordMisMatch' />
                        ),
                      });
                    } else {
                      let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/public/resetPassword`,
                        headers: {token: token, password: data.setpassword},
                      };

                      axios
                        .request(config)
                        .then((response) => {
                          resetForm();
                          if (response.status === 200) {
                            console.log(JSON.stringify(response.data));
                            setMessage('success');
                            toast.success('Password set Successfully');
                            setLoading(false);
                            // Gotosign();
                          } else if (response.status === 404) {
                            setMessage('Invalid token');
                            toast.error('Invalid token');
                            setLoading(false);
                          } else if (response.status === 401) {
                            setMessage('Verification link expired');
                            toast.error('Verification link expired');
                            setLoading(false);
                          } else {
                            setMessage('Unexpected response');
                            toast.error('Unexpected response');
                            setLoading(false);
                          }
                        })
                        .catch((error) => {
                          setLoading(false);
                          console.log(error);
                          toast.error(error?.response?.data?.error);
                        });
                    }
                  }}
                >
                  {({isSubmitting}) => (
                    <Form
                      sx={{
                        textAlign: 'left',
                        marginBottom: {xs: 4, lg: 6, xl: 12},
                      }}
                      noValidate
                      autoComplete='off'
                    >
                      {message !== 'success' ? (
                        <Box
                          sx={{
                            mb: {xs: 3, xl: 4},
                          }}
                        >
                          <AppTextField
                            label={<IntlMessages id='common.resetPassword' />}
                            name='setpassword'
                            type={showPassword ? 'text' : 'password'}
                            variant='outlined'
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)', // Normal border color
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)', // Focused border color
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#4D4746', // Normal label color
                                '&.Mui-focused': {
                                  color: '#4D4746', // Focused label color
                                },
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge='end'
                                  >
                                    {showPassword ? (
                                      <Visibility />
                                    ) : (
                                      <VisibilityOff />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      ) : (
                        ''
                      )}

                      {message !== 'success' ? (
                        <Box
                          sx={{
                            mb: {xs: 3, xl: 4},
                          }}
                        >
                          <AppTextField
                            label={<IntlMessages id='common.confirmpassword' />}
                            name='confirmpassword'
                            type={confirmshowPassword ? 'text' : 'password'}
                            variant='outlined'
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)', // Normal border color
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)', // Focused border color
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#4D4746', // Normal label color
                                '&.Mui-focused': {
                                  color: '#4D4746', // Focused label color
                                },
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    onClick={toggleComfirmPasswordVisibility}
                                    edge='end'
                                  >
                                    {confirmshowPassword ? (
                                      <Visibility />
                                    ) : (
                                      <VisibilityOff />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      ) : (
                        <IntlMessages id='common.setispassword' />
                      )}

                      {/* <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: {sm: 'center'},
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            ml: -3,
                          }}
                        >
                          <Checkbox />
                        </Box>
                        <Box
                          component='span'
                          sx={{
                            fontSize: 14,
                          }}
                        >
                          <IntlMessages id='common.rememberMe' />
                        </Box>
                      </Box>
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
                      >
                        <IntlMessages id='common.forgetPassword' />
                      </Box>
                    </Box> */}
                      {message !== 'success' ? (
                        <Button
                          variant='contained'
                          color='primary'
                          type='submit'
                          disabled={loading}
                          sx={{
                            width: '100%',
                            height: 44,
                          }}
                        >
                          {loading ? (
                            'Loading...'
                          ) : (
                            <IntlMessages id='common.setpassword' />
                          )}
                        </Button>
                      ) : (
                        ''
                      )}
                    </Form>
                  )}
                </Formik>
              </Box>

              {message !== '' && (
                <Box
                  component='span'
                  sx={{
                    color: '#4D4746',
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center', // Center the text with respect to the button
                    gap: 3,
                    textAlign: 'center',
                  }}
                >
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={loading}
                    sx={{
                      width: 'auto',
                      height: 'auto',
                    }}
                    onClick={() => {
                      if (message === 'success') {
                        NavigateTosignin();
                      } else if (message === 'Invalid token') {
                        SendMail();
                      } else if (message === 'Account already verified') {
                        NavigateTosignin();
                      } else if (message === 'Verification link expired') {
                        SendMail();
                      } else if (
                        message ===
                        'Your account has already been verified. You can start using the application.'
                      ) {
                        NavigateTosignin();
                      } else {
                        // handle default case
                      }
                    }}
                  >
                    {message === 'success' ? (
                      <IntlMessages id='common.signin' />
                    ) : message ===
                      'Your account has already been verified. You can start using the application.' ? (
                      <IntlMessages id='common.signin' />
                    ) : message === 'Invalid token' ? (
                      'Send Mail'
                    ) : message === 'Account already verified' ? (
                      <IntlMessages id='common.signin' />
                    ) : message === 'Verification link expired' ? (
                      'Send Mail'
                    ) : (
                      'Send Mail'
                    )}
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default Verifed;
