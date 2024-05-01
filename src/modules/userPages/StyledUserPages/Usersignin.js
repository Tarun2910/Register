import React, {useState} from 'react';
import Card from '@mui/material/Card';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import {ReactComponent as Logo} from '../../../assets/user/login.svg';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthMethod} from '@crema/hooks/AuthHooks';
import axios from 'axios';
import {toast} from 'react-toastify';

const validationSchema = yup.object({
  email: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const Usersignin = () => {
  const theme = useTheme();
  const {messages} = useIntl();
  const {logInWithEmailAndPassword} = useAuthMethod();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(10);
  const [applicationName, setApplicationName] = useState('OmniLearn Pro');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setProduct(event.target.value);
    switch (event.target.value) {
      case 10:
        setApplicationName('OmniLearn Pro');
        break;
      case 20:
        setApplicationName('TeamSync');
        break;
      case 30:
        setApplicationName('Claros');
        break;
      default:
        setApplicationName('');
    }
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
            // display: 'flex',
            // position: 'relative',

            background: 'rgba(255, 255, 255, 0.6)',

            WebkitBackdropFilter: ' blur(4px)',
            backdropFilter: 'blur(4px)',
            justifyContent: 'space-between',
            borderRadius: '0.4rem',
            // boxShadow:
            //   'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
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
              <Logo fill={theme.palette.primary.main} />
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
                <IntlMessages id='common.userlogin' />
              </Box>

              <Formik
                validateOnChange={true}
                initialValues={{
                  email: '',
                  password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(data, {resetForm}) => {
                  // resetForm();
                  setLoading(true);
                  let formdata = new FormData();
                  formdata.append('username', data.email);
                  formdata.append('password', data.password);

                  let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: '/tenants/users/login',
                    headers: {appName: applicationName},
                    data: formdata,
                  };

                  axios
                    .request(config)
                    .then((response) => {
                      console.log(JSON.stringify(response.data));
                      setLoading(false);
                      // sessionStorage.setItem(
                      //   'jwt_token',
                      //   response.data.access_token,
                      // );
                      //   navigate('/dashboards');
                      toast.success('Login sucessfully');
                    })
                    .catch((error) => {
                      setLoading(false);
                      toast.error(
                        'This user has not been activated.Please contact your organization administrator',
                      );
                      console.log(error);
                    });

                  //   // for testing
                  //   sessionStorage.setItem('jwt_token', 'hello');
                  //   navigate('/dashboards');
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
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginBottom: '18px',
                      }}
                    >
                      <p style={{marginRight: '10px'}}>
                        Application you wanted to login to:
                      </p>
                      <FormControl
                        sx={{minWidth: '10rem', marginRight: '10px'}}
                      >
                        <InputLabel id='demo-simple-select-label'>
                          Products
                        </InputLabel>
                        <Select
                          sx={{height: '2rem', width: '100%'}} // Set height and width
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={product}
                          label='Products'
                          onChange={handleChange}
                        >
                          <MenuItem value={10}>OmniLearn Pro</MenuItem>
                          <MenuItem value={20}>TeamSync</MenuItem>
                          <MenuItem value={30}>Claros</MenuItem>
                        </Select>
                      </FormControl>
                    </span>

                    <Box sx={{mb: {xs: 5, xl: 8}}}>
                      <AppTextField
                        placeholder={messages['common.email']}
                        label={<IntlMessages id='common.email' />}
                        name='email'
                        variant='outlined'
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Box>

                    <Box sx={{mb: {xs: 5, xl: 8}}}>
                      <AppTextField
                        type='password'
                        placeholder={messages['common.password']}
                        label={<IntlMessages id='common.password' />}
                        name='password'
                        variant='outlined'
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Box>

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
                        <IntlMessages id='common.login' />
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>

              {/* <Box
                sx={{
                  mt: {xs: 3, xl: 4},
                  mb: 3,
                  display: 'flex',
                  flexDirection: {xs: 'column', sm: 'row'},
                  justifyContent: {sm: 'center'},
                  alignItems: {sm: 'center'},
                }}
              >
                <Box
                  component='span'
                  sx={{
                    color: grey[600],
                    fontSize: 14,
                    mr: 4,
                  }}
                >
                  <IntlMessages id='common.orLoginWith' />
                </Box>
                <Box display='inline-block'>
                  <IconButton>
                    <FacebookIcon sx={{color: 'text.primary'}} />
                  </IconButton>
                  <IconButton>
                    <GitHubIcon sx={{color: 'text.primary'}} />
                  </IconButton>
                  <IconButton>
                    <TwitterIcon sx={{color: 'text.primary'}} />
                  </IconButton>
                </Box>
              </Box> */}

              {/* <Box
                sx={{
                  mt: {xs: 6, xl: 8},
                  mb: 3,
                  color: 'grey.700',
                  fontSize: 14,
                  fontWeight: Fonts.BOLD,
                }}
              >
                <Box
                  component='span'
                  sx={{
                    mr: 2,
                  }}
                >
                  <IntlMessages id='common.dontHaveAccount' />
                </Box>
                <Box
                  component='span'
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                  }}
                >
                  <Link to='/signup'>
                    <IntlMessages id='common.signup' />
                  </Link>
                </Box>
              </Box> */}
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default Usersignin;
