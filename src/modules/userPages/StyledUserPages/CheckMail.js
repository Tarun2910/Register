import React, {useState} from 'react';
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
import Arc from '../../../assets/user/arcTeam.png';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthMethod} from '@crema/hooks/AuthHooks';
import axios from 'axios';
import {Visibility, VisibilityOff} from '@mui/icons-material';
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

const CheckMail = () => {
  const theme = useTheme();
  const {messages} = useIntl();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSendMailAgain = () => {
    setLoading(true);
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
        toast.error(error?.response?.data?.error);
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
              <img style={{maxWidth: '75%', marginBottom: '10px'}} src={Arc} />
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
                <IntlMessages id='common.verifymail' />
              </Box>
              <Box
                sx={{
                  mb: {xs: 5, xl: 8},
                  fontWeight: Fonts.MEDIUM,
                  fontSize: 15,
                }}
              >
                <IntlMessages id='common.mailmsg' />
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
                <IntlMessages id='common.didntreceivemail' />
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  sx={{
                    width: 'auto',
                    height: 'auto',
                  }}
                  onClick={handleSendMailAgain}
                  disabled={loading}
                >
                  <IntlMessages id='common.sendagain' />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default CheckMail;
