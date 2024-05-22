import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import {Fonts} from '@crema/constants/AppEnums';
import AppAnimate from '@crema/components/AppAnimate';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
// import {ReactComponent as Logo} from '../../../assets/user/cipher-guard021.svg';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {debounce} from 'lodash';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {toast} from 'react-toastify';
import pic from '../../../assets/user/access-arc-05.png';

const validationSchema = yup.object({
  Orgname: yup.string().required(<IntlMessages id='validation.nameRequired' />),
  adminemail: yup
    .string()
    // .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  adminUsername: yup
    .string()
    // .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.AdminusernameRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
  adminName: yup
    .string()
    .required(<IntlMessages id='validation.adminnameRequired' />),
  confirmPassword: yup
    .string()
    .required(<IntlMessages id='validation.reTypePassword' />),
});

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [domainStatus, setDomainStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmshowPassword, setConfirmShowPassword] = useState(false);

  const updateDomain = (event) => {
    const {value} = event.target;
    setDomain(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleComfirmPasswordVisibility = () => {
    setConfirmShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    if (domain === '') {
      setDomainStatus(null);
    }
  }, [domain]);

  useEffect(() => {
    const checkDomainAvailability = debounce(() => {
      setLoading(true);
      axios
        .get(`/tenants/domains?emailDomain=@${domain}`)
        .then((response) => {
          setLoading(false);
          console.log(response, 'response');
          if (response.status === 200) {
            setDomainStatus('available');
          } else if (response.status === 409) {
            setDomainStatus('unavailable');
          }
        })
        .catch((error) => {
          setLoading(false);
          setDomainStatus('unavailable');
        });
    }, 500); // Debounce time in milliseconds

    if (domain) {
      checkDomainAvailability();
    }

    return () => {
      checkDomainAvailability.cancel();
    };
  }, [domain]);

  console.log(domain, 'domain');
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

            background: 'rgba(255, 255, 255, 0.6)',

            WebkitBackdropFilter: ' blur(4px)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Grid
            container
            spacing={5}
            sx={{
              alignItems: {lg: 'center'},
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                textAlign: 'center',
                '& svg': {
                  display: 'inline-block',
                  paddingRight: {xs: 0, lg: 10},
                },
              }}
            >
              {/* <Logo fill={theme.palette.primary.main} /> */}
              <img src={pic} />
              <Typography>
                AccessArc is a robust license management system designed to
                streamline and curate your company software privileges. It
                ensures efficient allocation and monitoring of licenses,
                optimizing usage and compliance. With AccessArc, you gain full
                control over your software assets, reducing costs and enhancing
                operational efficiency
              </Typography>
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
                  mb: {xs: 6, xl: 8},
                  fontWeight: Fonts.BOLD,
                  fontSize: 20,
                }}
              >
                <IntlMessages id='common.signupforOrg' />
              </Box>

              <Formik
                initialValues={{
                  Orgname: '',
                  Domain: '',
                  adminName: '',
                  password: '',
                  adminemail: '',
                  adminUsername: '',
                  confirmPassword: '',
                }}
                // validationSchema={validationSchema}
                onSubmit={(data, {setErrors, resetForm}) => {
                  // setLoading(true);
                  // if (data.password !== data.confirmPassword) {
                  //   setLoading(false);
                  //   setErrors({
                  //     confirmPassword: (
                  //       <IntlMessages id='validation.passwordMisMatch' />
                  //     ),
                  //   });
                  // } else {
                  //   let formdata = new FormData();
                  //   formdata.append('orgName', data.Orgname);
                  //   formdata.append('adminName', data.adminName);
                  //   formdata.append(
                  //     'adminEmail',
                  //     `${data.adminemail.toLowerCase()}@${domain}`,
                  //   );
                  //   formdata.append('adminUsername', data.adminUsername);
                  //   formdata.append('password', data.password);

                  //   let config = {
                  //     method: 'post',
                  //     maxBodyLength: Infinity,
                  //     url: '/tenants/register',
                  //     headers: {},
                  //     data: formdata,
                  //   };

                  //   axios
                  //     .request(config)
                  //     .then((response) => {
                  //       setLoading(false);
                  //       console.log(JSON.stringify(response.data));
                  //       navigate('/signin');
                  //     })
                  //     .catch((error) => {
                  //       toast.error(error.message);
                  //       console.log(error);
                  //       setLoading(false);
                  //     });
                  //
                  // }
                  navigate('/check-mail');
                }}
              >
                {({isSubmitting}) => (
                  <Form noValidate autoComplete='off'>
                    {/* <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <AppTextField
                        label={<IntlMessages id='common.Orgname' />}
                        name='Orgname'
                        variant='outlined'
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <TextField
                        label={<IntlMessages id='common.domain' />}
                        name='Domain'
                        variant='outlined'
                        sx={{
                          width: '100%',
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              {loading && (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <CircularProgress
                                    size={24}
                                    color='inherit'
                                    style={{marginRight: '5px'}}
                                  />
                                  <span style={{color: 'grey'}}>
                                    Checking Availability ...
                                  </span>
                                </div>
                              )}

                              {domainStatus === 'available' && !loading && (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <DoneIcon
                                    fontSize='small'
                                    style={{marginRight: '5px', color: 'green'}}
                                  />
                                  <span style={{color: 'green'}}>
                                    Domain available
                                  </span>
                                </div>
                              )}
                              {domainStatus === 'unavailable' && !loading && (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <WarningAmberIcon
                                    fontSize='small'
                                    style={{marginRight: '5px', color: 'red'}}
                                  />
                                  <span style={{color: 'red'}}>
                                    Domain already Registered
                                  </span>
                                </div>
                              )}
                              {domainStatus === null && ''}
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position='start'>@</InputAdornment>
                          ),
                        }}
                        onChange={updateDomain}
                      />
                    </Box> */}

                    <Box sx={{display: 'flex', gap: 2, mb: {xs: 3, xl: 4}}}>
                      <AppTextField
                        label={<IntlMessages id='common.Orgname' />}
                        name='Orgname'
                        variant='outlined'
                        sx={{
                          width: '50%',
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
                      />
                      <AppTextField
                        label={<IntlMessages id='common.adminName' />}
                        name='adminName'
                        variant='outlined'
                        sx={{
                          width: '50%',
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
                      />
                    </Box>

                    {/* <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <AppTextField
                        label={<IntlMessages id='common.adminName' />}
                        name='adminName'
                        variant='outlined'
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Box> */}
                    {/* <Box sx={{display: 'flex', gap: 2, mb: {xs: 3, xl: 4}}}>
                      <AppTextField
                        label={<IntlMessages id='common.adminUsername' />}
                        name='adminUsername'
                        type='text'
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
                      />
                    </Box> */}
                    <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <TextField
                        label={<IntlMessages id='common.domain' />}
                        name='Domain'
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
                            <>
                              {loading && (
                                <InputAdornment position='end'>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <CircularProgress
                                      size={24}
                                      color='inherit'
                                      style={{marginRight: '5px'}}
                                    />
                                    <span style={{color: 'grey'}}>
                                      Checking Availability ...
                                    </span>
                                  </div>
                                </InputAdornment>
                              )}
                              {domainStatus === 'available' && !loading && (
                                <InputAdornment position='end'>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <DoneIcon
                                      fontSize='small'
                                      style={{
                                        marginRight: '5px',
                                        color: 'green',
                                      }}
                                    />
                                    <span style={{color: 'green'}}>
                                      Domain available
                                    </span>
                                  </div>
                                </InputAdornment>
                              )}
                              {domainStatus === 'unavailable' && !loading && (
                                <InputAdornment position='end'>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <WarningAmberIcon
                                      fontSize='small'
                                      style={{marginRight: '5px', color: 'red'}}
                                    />
                                    <span style={{color: 'red'}}>
                                      Domain already Registered
                                    </span>
                                  </div>
                                </InputAdornment>
                              )}
                            </>
                          ),
                          startAdornment: (
                            <InputAdornment position='start'>@</InputAdornment>
                          ),
                        }}
                        onChange={updateDomain}
                      />
                    </Box>

                    <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <AppTextField
                        label={<IntlMessages id='common.adminemail' />}
                        name='adminemail'
                        type='email'
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
                              {`@${domain}`}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    {/* <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <AppTextField
                        label={<IntlMessages id='common.adminUsername' />}
                        name='adminUsername'
                        type='text'
                        variant='outlined'
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Box> */}

                    <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <AppTextField
                        label={<IntlMessages id='common.password' />}
                        name='password'
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

                    <Box
                      sx={{
                        mb: {xs: 3, xl: 4},
                      }}
                    >
                      <AppTextField
                        label={<IntlMessages id='common.confirmPassword' />}
                        name='confirmPassword'
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

                    <Button
                      variant='contained'
                      color='primary'
                      disabled={loading || domainStatus === 'unavailable'}
                      sx={{
                        width: '100%',
                        height: 44,
                        mt: {xs: 5, xl: 6},
                      }}
                      type='submit'
                    >
                      <IntlMessages id='common.signup' />
                    </Button>
                  </Form>
                )}
              </Formik>

              <Box
                sx={{
                  textAlign: 'center',
                  color: 'grey.700',
                  fontSize: 14,
                  fontWeight: Fonts.BOLD,
                  mt: {xs: 3, xl: 4},
                }}
              >
                <Box component='span' sx={{mr: 1, color: '#4D4746'}}>
                  <IntlMessages id='common.alreadyHaveAccount' />
                </Box>
                <Box
                  component='span'
                  sx={{
                    color: 'primary.main',
                    fontWeight: Fonts.MEDIUM,
                    cursor: 'pointer',
                  }}
                >
                  <Link to='/signin'>
                    <IntlMessages id='common.signInHere' />
                  </Link>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default Signup;
