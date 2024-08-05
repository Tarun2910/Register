import React, {useEffect, useState} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {Link, useNavigate} from 'react-router-dom';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppInfoView from '@crema/components/AppInfoView';
import {useAuthMethod} from '@crema/hooks/AuthHooks';
import {Fonts} from '@crema/constants/AppEnums';
import {AiOutlineGoogle, AiOutlineTwitter} from 'react-icons/ai';
import {FaFacebookF} from 'react-icons/fa';
import {BsGithub} from 'react-icons/bs';
import AuthWrapper from '../AuthWrapper';
import axios from 'axios';
import OtpInput from 'react-otp-input';
import '../../../styles/base.css';
import CryptoJS from 'crypto-js';
import {initialUrl} from '@crema/constants/AppConst';
import {toast} from 'react-toastify';

const validationSchema = yup.object({
  username: yup
    .string()
    // .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.usernameRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const SigninFirebase = () => {
  const onGoBackToHome = () => {
    navigate('/dashboards/academy');
  };
  const {logInWithEmailAndPassword, logInWithPopup} = useAuthMethod();
  const navigate = useNavigate();

  const [qr, setQr] = useState(false);
  const [byteArray, setByteArray] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState(false);
  const [Image, setImage] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [loginData, setLoginData] = useState('');
  const [userData, setUserData] = useState([]);
  const [issubmit, setIsSubmit] = useState(false);

  const autoLogin = sessionStorage.getItem('re_intiate');

  const onGoToForgetPassword = () => {
    navigate('/forget-password', {tab: 'firebase'});
  };

  const {messages} = useIntl();

  const userValue = {
    username: '1201',
    password: 'demo',
  };
  const userValuejson = JSON.stringify(userValue);

  useEffect(() => {
    if (isCheckboxChecked) {
      handleConfigureOTP();
    }
  }, [isCheckboxChecked]);

  function encryptFun(password, username) {
    var keybefore = username + 'appolocomputers';
    var ivbefore = username + 'costacloud012014';
    var key = CryptoJS.enc.Latin1.parse(keybefore.substring(0, 16));
    var iv = CryptoJS.enc.Latin1.parse(ivbefore.substring(0, 16));
    var ciphertext = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    }).toString();
    return ciphertext;
  }

  // useEffect(() => {
  //   if (qr && status === 'OTP not enabled. Please set up.') {
  //     // Make your API call here
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.post(`/auth/kms/show-qr`, loginData, {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             isManual: true,
  //           },
  //           responseType: 'arraybuffer',
  //         });
  //         const base64Image = btoa(
  //           new Uint8Array(response.data).reduce(
  //             (data, byte) => data + String.fromCharCode(byte),
  //             '',
  //           ),
  //         );
  //         const imageUrl = `data:image/png;base64,${base64Image}`;
  //         setImage(imageUrl);
  //         setByteArray(response.data);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };

  //     fetchData(); // Call the function to make the API request
  //   }
  // }, [qr, status]);

  const handleshowQR = async () => {
    try {
      const response = await axios.post(`/auth/kms/show-qr`, loginData, {
        headers: {
          'Content-Type': 'application/json',
          isManual: false,
        },
        responseType: 'arraybuffer',
      });
      console.log(response, 'arrayBuffer');
      setByteArray(response.data);
      // handleConfigureOTP(response.data); // Call the function to handle OTP configuration with the obtained data
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfigureOTP = async () => {
    try {
      // Create a Uint8Array from the received ArrayBuffer
      const uint8Array = new Uint8Array(byteArray);

      // Create a Blob from the Uint8Array
      const blob = new Blob([uint8Array], {type: 'application/octet-stream'});

      // Create FormData and append the Blob
      const formData = new FormData();
      formData.append('qrCode', blob, 'qrCode.bin');

      const response = await axios.post(`/auth/kms/otp-configured`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserDetails = async () => {
    try {
      const response = await axios.get(`/kms/users/detail`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setUserData(response?.data?.roles);
      const rolesString = JSON.stringify(response?.data?.roles);
      sessionStorage.setItem('roles', rolesString);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsSubmit(true);
      const response = await axios.post(
        `/auth/kms/verify-otp?otp=${otp}`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
            isManual: 'false',
          },
        },
      );
      sessionStorage.setItem('token', response.data.access_token);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      await handleUserDetails();
      logInWithEmailAndPassword({
        email: 'crema.demo@gmail.com',
        password: 'Pass@1!@all',
      });
      setIsSubmit(false);
      const id = setInterval(() => {
        refreshToken();
      }, 400000);
      sessionStorage.setItem('refresh_session', id); // on logout i will unsubscribe from refresh token
      sessionStorage.setItem('re_intiate', true); // to handle the bug of automatically login when re-open app after close
      // ReactDOM.render(<App />, document.getElementById('root'));
      // history.push({
      //   pathname: '/eoffice/dms/FileManager',
      // });
      const targetURl = '/signin';
      navigate(targetURl);
    } catch (err) {
      console.log(err);
      toast.error('error');
      setIsSubmit(false);
    }
  };

  const handleVerifyOTPAfterScan = async () => {
    setIsSubmit(true);
    try {
      const uint8Array = new Uint8Array(byteArray);

      // Create a Blob from the Uint8Array
      const blob = new Blob([uint8Array], {type: 'application/octet-stream'});
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);
      formData.append('otp', otp);
      formData.append('qrCode', blob, 'qrCode.bin');
      const response = await axios.post(
        `/auth/kms/verify-otp-first`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            isManual: 'false',
          },
        },
      );
      console.log(response, 'response');
      sessionStorage.setItem('token', response.data.access_token);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      await handleUserDetails();
      logInWithEmailAndPassword({
        email: 'crema.demo@gmail.com',
        password: 'Pass@1!@all',
      });
      setIsSubmit(false);
      const id = setInterval(() => {
        refreshToken();
      }, 400000);
      sessionStorage.setItem('refresh_session', id); // on logout i will unsubscribe from refresh token
      sessionStorage.setItem('re_intiate', true); // to handle the bug of automatically login when re-open app after close
      // ReactDOM.render(<App />, document.getElementById('root'));
      // history.push({
      //   pathname: '/eoffice/dms/FileManager',
      // });
      const targetURl = '/signin';
      navigate(targetURl);
    } catch (err) {
      console.log(err);
      toast.error('error');
      setIsSubmit(false);
    }
  };

  const handleRefreshToken = () => {
    // unsubscribe to refresh token api when refresh
    const id = sessionStorage.getItem('refresh_session');
    clearInterval(id);
    const isSuccess = refreshToken();
    if (isSuccess) {
      // Refresh is succesfull so now i am listining for refresh token after some time
      const id = setInterval(() => {
        refreshToken();
      }, 400000);

      sessionStorage.setItem('refresh_session', id); // on logout i will unsubscribe from refresh token
    }
  };

  const refreshToken = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: sessionStorage.getItem('refresh_token'),
      });
      const login = await (
        await fetch('/auth/refresh-token', {
          method: 'POST',
          headers,
          body: data,
        })
      ).json();
      if (login.message) {
        sessionStorage.clear();
        sessionStorage.clear();
        redirectToLogin();
      } // important to clear first because previous logged in might contain some inboxId or imp data
      else if (login.access_token) {
        sessionStorage.setItem('token', login.access_token);
        sessionStorage.setItem('sessionId', login.session_state);
        sessionStorage.setItem('refresh_token', login.refresh_token);
        sessionStorage.setItem('expires_in', login.expires_in);
        return true;
      } else {
        redirectToLogin();
      }
    } catch (error) {
      redirectToLogin();
      // dispatch(setSnackbar(true, "error", error));
    }
  };

  const redirectToLogin = () => {
    // unsubscribe to refresh token api when there is an error in it
    const id = sessionStorage.getItem('refresh_session');
    clearInterval(id);
    sessionStorage.clear();
    sessionStorage.clear();
  };

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleButtonClick = () => {
    navigate('/dashboards/crypto');
  };

  useEffect(() => {
    autoLogin && handleRefreshToken();
  }, []);

  useEffect(() => {
    if (!autoLogin) {
      sessionStorage.clear();
      sessionStorage.clear();
    }
  }, [autoLogin]);

  return (
    <AuthWrapper>
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', mb: 5}}>
          {/* <button onClick={onGoBackToHome}>Login</button> */}
          <Formik
            validateOnChange={true}
            initialValues={{
              // email: 'crema.demo@gmail.com',
              // password: 'Pass@1!@all',
              username: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              console.log(data);
              // setLoginData(data);
              const modifyData = {
                username: data.username,
                password: encryptFun(data.password, data.username),
              };
              setLoginData(modifyData);
              // setSubmitting(true);
              // logInWithEmailAndPassword(data);
              // setSubmitting(false);
              const fetchData = async () => {
                setIsSubmit(true);
                try {
                  const response = await axios.post(
                    `/auth/kms/login`,
                    modifyData,
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        isManual: false,
                      },
                      responseType: 'arraybuffer',
                    },
                  );
                  if (response.status === 204) {
                    setStatus(true);
                  } else {
                    setStatus(false);
                  }
                  const base64Image = btoa(
                    new Uint8Array(response.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      '',
                    ),
                  );
                  const imageUrl = `data:image/png;base64,${base64Image}`;
                  setImage(imageUrl);
                  setByteArray(response?.data);
                  setQr(true);
                  setIsSubmit(false);
                } catch (err) {
                  console.log(err);
                  setIsSubmit(false);
                }
              };

              {
                qr && status
                  ? handleVerifyOTP()
                  : qr && status === false
                  ? handleVerifyOTPAfterScan()
                  : fetchData();
              }

              // onGoToForgetPassword();
            }}
          >
            {({isSubmitting}) => (
              <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>
                {qr === false && (
                  <Box sx={{mb: {xs: 5, xl: 8}}}>
                    <AppTextField
                      placeholder={messages['username']}
                      name='username'
                      label={<IntlMessages id='common.username' />}
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                      autoComplete='off'
                    />
                  </Box>
                )}

                <Box sx={{mb: {xs: 3, xl: 4}}}>
                  {qr === false ? (
                    <AppTextField
                      type='password'
                      placeholder={messages['password']}
                      label={<IntlMessages id='common.password' />}
                      name='password'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                      autoComplete='off'
                    />
                  ) : qr && status ? (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={
                          <span style={{margin: '0 5px'}}></span>
                        }
                        renderInput={(props) => (
                          <input {...props} className='otp-class' />
                        )}
                      />
                    </div>
                  ) : (
                    <>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <img src={Image} alt='qr code' />
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          renderSeparator={
                            <span style={{margin: '0 5px'}}></span>
                          }
                          renderInput={(props) => (
                            <input {...props} className='otp-class' />
                          )}
                        />
                      </div>
                    </>
                  )}
                </Box>

                {/* {qr && status === 'OTP not enabled. Please set up.' ? (
                  <Box
                    sx={{
                      mb: {xs: 3, xl: 4},
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox
                        sx={{ml: -3}}
                        checked={isCheckboxChecked}
                        onChange={handleCheckboxChange}
                      />
                      <Box
                        component='span'
                        sx={{
                          color: 'grey.500',
                        }}
                      >
                        <IntlMessages id='common.scanned' />
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  // <Box
                  //   sx={{
                  //     mb: {xs: 3, xl: 4},
                  //   }}
                  // >
                  //   <Box
                  //     sx={{
                  //       display: 'flex',
                  //       alignItems: 'center',
                  //     }}
                  //   >
                  //     <Checkbox sx={{ml: -3}} />
                  //     <Box
                  //       component='span'
                  //       sx={{
                  //         color: 'grey.500',
                  //       }}
                  //     >
                  //       <IntlMessages id='common.rememberMe' />
                  //     </Box>
                  //   </Box>
                  // </Box>
                  ''
                )} */}

                <div style={{display: 'flex', justifyContent: 'center'}}>
                  {qr && status === false ? (
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled={issubmit}
                      sx={{
                        minWidth: 160,
                        fontWeight: Fonts.REGULAR,
                        fontSize: 16,
                        textTransform: 'capitalize',
                        padding: '4px 16px 8px',
                        marginTop: '2rem',
                      }}
                    >
                      <IntlMessages id='common.confirmOtp' />
                    </Button>
                  ) : qr &&
                    status ===
                      'OTP already set up. Please use OTP from your Authenticator app to login.' ? (
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled={issubmit}
                      sx={{
                        minWidth: 160,
                        fontWeight: Fonts.REGULAR,
                        fontSize: 16,
                        textTransform: 'capitalize',
                        padding: '4px 16px 8px',
                      }}
                    >
                      <IntlMessages id='common.confirmOtp' />
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled={issubmit}
                      sx={{
                        minWidth: 160,
                        fontWeight: Fonts.REGULAR,
                        fontSize: 16,
                        textTransform: 'capitalize',
                        padding: '4px 16px 8px',
                      }}
                    >
                      <IntlMessages id='common.login' />
                    </Button>
                    // <button onClick={onGoBackToHome}>Login</button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Box>

        {/* <Box
          sx={{
            color: 'grey.500',
            mb: {xs: 5, md: 7},
          }}
        >
          {qr ? (
            ''
          ) : (
            <span style={{marginRight: 4}}>
              <IntlMessages id='common.dontHaveAccount' />
            </span>
          )}
          <Box
            component='span'
            sx={{
              fontWeight: Fonts.MEDIUM,
              '& a': {
                color: (theme) => theme.palette.primary.main,
                textDecoration: 'none',
              },
            }}
          >
            {qr ? (
              ''
            ) : (
              <Link to='/signup'>
                <IntlMessages id='common.signup' />
              </Link>
            )}
          </Box>
        </Box> */}

        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default SigninFirebase;
