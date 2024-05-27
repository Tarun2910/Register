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
  email: yup
    .string()
    // .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const Verifed = () => {
  const theme = useTheme();
  const {messages} = useIntl();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const {token} = useParams();

  console.log(token);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const NavigateTosignin = () => {
    navigate('/signin');
  };

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: '/tenants/verifyEmail',
      headers: {token: token},
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          console.log(JSON.stringify(response.data));
          setMessage('success');
          setLoading(false);
        } else if (response.status === 404) {
          setMessage('Invalid token');
          setLoading(false);
        } else if (response.status === 405) {
          setMessage('Account already verified');
          setLoading(false);
        } else if (response.status === 401) {
          setMessage('Verification link expired');
          setLoading(false);
        } else {
          setMessage('Unexpected response');
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setMessage('Invalid token');
          } else if (error.response.status === 405) {
            setMessage('Account already verified');
          } else if (error.response.status === 401) {
            setMessage('Verification link expired');
          } else if (error.response.status === 409) {
            setMessage(
              'Your account has already been verified. You can start using the application.',
            );
          } else {
            setMessage('Unexpected error');
          }
        } else {
          setMessage('Error: ' + error.message);
        }
        setLoading(false);
        console.log(error);
      });
  }, []);

  let verifyMessage = '';
  switch (message) {
    case 'success':
      verifyMessage = <IntlMessages id='common.verifymsg' />;
      break;
    case 'Invalid token':
      verifyMessage = <IntlMessages id='common.invalidTokenMsg' />;
      break;
    case 'Account already verified':
      verifyMessage = <IntlMessages id='common.accountVerifiedMsg' />;
      break;
    case 'Verification link expired':
      verifyMessage = <IntlMessages id='common.verificationExpiredMsg' />;
      break;
    case 'Your account has already been verified. You can start using the application.':
      verifyMessage =
        'Your account has already been verified. You can start using the application.';
      break;
    default:
      verifyMessage = <IntlMessages id='common.unknownErrorMsg' />;
      break;
  }

  let verify = '';
  switch (message) {
    case 'success':
      verify = <IntlMessages id='common.verify' />;
      break;
    case 'Invalid token':
      verify = <IntlMessages id='common.invalidToken' />;
      break;
    case 'Account already verified':
      verify = <IntlMessages id='common.accountVerified' />;
      break;
    case 'Verification link expired':
      verify = <IntlMessages id='common.verificationExpired' />;
      break;
    case 'Your account has already been verified. You can start using the application.':
      verify = 'Mail ALready Verified';
      break;
    default:
      verify = 'Please Wait for the response';
      break;
  }

  const SendMail = () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/tenants/sendTokenAgain',
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
                {verify}
              </Box>
              <Box
                sx={{
                  mb: {xs: 5, xl: 8},
                  fontWeight: Fonts.MEDIUM,
                  fontSize: 15,
                }}
              >
                {/* <IntlMessages id='common.verifymsg' /> */}
                {loading ? <CircularProgress /> : verifyMessage}
              </Box>

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
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default Verifed;
