import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import App from 'app/App';
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Slide,
} from '@material-ui/core';
import {Lock, Visibility, VisibilityOff} from '@mui/icons-material';
import qs from 'qs';
import './_index.scss';
import Loading from 'matx/components/MatxLoadable/Loading';
// import { setSnackbar } from "../../pa/src/app/camunda_redux/redux/ducks/snackbar";
// import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import history from './history';
import Feedback from 'app/views/user-activity/logout/Feedback';
import {handleError} from 'utils';
import {Alert} from '@material-ui/lab';
import Axios from 'axios';
import OtpInput from 'react-otp-input';

const LoginPage = (props) => {
  const [showPassword, setshowPassword] = useState(false);
  const [Cred, setCred] = useState({
    username: '',
    password: '',
    error: '',
  });
  const Authorization = props.Authorization;
  const username = props.userNameFeedback;
  const deptName = props.deptName;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [qr, setQr] = useState(false);
  const [byteArray, setByteArray] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState(false);
  const [Image, setImage] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [loginData, setLoginData] = useState('');
  const [userData, setUserData] = useState([]);
  // let Prime_No, Primitive, Private_Key_A, Secret_A, Shared_Secret;

  // let salt;

  const userName = localStorage.getItem('username');
  const autoLogin = sessionStorage.getItem('re_intiate');

  console.log(loginData);

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

  const handleClose = () => setOpen(false);

  const handleVerifyOTP = async () => {
    try {
      const response = await Axios.post(
        `/auth/kms/verify-otp?otp=${otp}`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
            isManual: 'false',
          },
        },
      );

      if (!response.data.access_token) {
        // console.log("errmssg", response.data.access_token);
        setCred({
          ...Cred,
          error: response || response.error,
        });
        setLoading(false);
      } else {
        console.log('successmssg');
        // Here means login is successfull
        sessionStorage.setItem('token', response.data.access_token);
        sessionStorage.setItem('sessionId', response.data.session_state);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('username', Cred.username);
        localStorage.setItem('expires_in', response.data.expires_in);
        document.body.style.zoom = '95%';

        // Login is succesfull so now i am listining for referesh token after some time
        const id = setInterval(() => {
          refreshToken();
        }, 400000);
        setLoading(false);
        localStorage.setItem('refresh_session', id); // on logout i will unsubscribe from refresh token
        sessionStorage.setItem('re_intiate', true); // to handle the bug of automatically login when re-open app after close
        ReactDOM.render(<App />, document.getElementById('root'));
        history.push({
          pathname: '/eoffice/dms/FileManager',
        });
      }
    } catch (err) {
      console.log(err.message);
      if (
        err.message &&
        err.message.includes('Request failed with status code 409')
      ) {
        alert('Incorrect OTP: The provided OTP is invalid.'); // Improved alert message
      }
    }
  };

  const handleVerifyOTPAfterScan = async () => {
    try {
      const uint8Array = new Uint8Array(byteArray);

      // Create a Blob from the Uint8Array
      const blob = new Blob([uint8Array], {type: 'application/octet-stream'});
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);
      formData.append('otp', otp);
      formData.append('qrCode', blob, 'qrCode.bin');
      const response = await Axios.post(
        `/auth/kms/verify-otp-first`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            isManual: false,
          },
        },
      );
      console.log(response, 'response');

      if (!response.data.access_token) {
        // console.log("errmssg", response.data.access_token);
        setCred({
          ...Cred,
          error: response || response.error,
        });
        setLoading(false);
      } else {
        console.log('successmssg');
        // Here means login is successfull
        sessionStorage.setItem('token', response.data.access_token);
        sessionStorage.setItem('sessionId', response.data.session_state);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('username', Cred.username);
        localStorage.setItem('expires_in', response.data.expires_in);
        document.body.style.zoom = '95%';

        // Login is succesfull so now i am listining for referesh token after some time
        const id = setInterval(() => {
          refreshToken();
        }, 400000);
        setLoading(false);
        localStorage.setItem('refresh_session', id); // on logout i will unsubscribe from refresh token
        sessionStorage.setItem('re_intiate', true); // to handle the bug of automatically login when re-open app after close
        ReactDOM.render(<App />, document.getElementById('root'));
        history.push({
          pathname: '/eoffice/dms/FileManager',
        });
      }
    } catch (err) {
      console.log(err);
      if (
        err.message &&
        err.message.includes('Request failed with status code 409')
      ) {
        alert('Incorrect OTP: The provided OTP is invalid.'); // Improved alert message
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(event);
    try {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        isManual: 'false',
      };

      const data = JSON.stringify({
        username: Cred.username,
        password: encryptFun(Cred.password, Cred.username),
        // keycloak: window.__ENV__.REACT_APP_KEYCLOACK,
        // client_id: window.__ENV__.REACT_APP_CLIENT_ID,
      });
      const dataWithoutstringify = {
        username: Cred.username,
        password: encryptFun(Cred.password, Cred.username),
      };

      setLoginData(dataWithoutstringify);

      const login = await Axios.post(`/auth/kms/login`, data, {
        headers: {
          'Content-Type': 'application/json',
          isManual: false,
        },
        responseType: 'arraybuffer',
      });
      if (login.status === 204) {
        setStatus(true);
        setLoading(false);
      } else if (login.status === 200) {
        setStatus(false);
        setLoading(false);
      }
      const base64Image = btoa(
        new Uint8Array(login.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      const imageUrl = `data:image/png;base64,${base64Image}`;
      setImage(imageUrl);
      setByteArray(login?.data);
      setQr(true);
      // if (login || !login.access_token) {
      //   setCred({
      //     ...Cred,
      //     error: login || login.error,
      //   });
      //   setLoading(false);
      // } else {
      //   // Here means login is successfull
      //   sessionStorage.setItem("token", login.access_token);
      //   sessionStorage.setItem("sessionId", login.session_state);
      //   localStorage.setItem("refresh_token", login.refresh_token);
      //   localStorage.setItem("username", Cred.username);
      //   localStorage.setItem("expires_in", login.expires_in);
      //   document.body.style.zoom = "95%";

      //   // Login is succesfull so now i am listining for referesh token after some time
      //   const id = setInterval(() => {
      //     refreshToken();
      //   }, 400000);
      //   setLoading(false);
      //   localStorage.setItem("refresh_session", id); // on logout i will unsubscribe from refresh token
      //   sessionStorage.setItem("re_intiate", true); // to handle the bug of automatically login when re-open app after close
      //   ReactDOM.render(<App />, document.getElementById("root"));
      //   history.push({
      //     pathname: "/eoffice/dms/FileManager",
      //   });
    } catch (error) {
      setLoading(false);
      let errMsg = handleError(error.message);
      setCred({
        ...Cred,
        error: errMsg,
      });
    }
    {
      qr && status
        ? handleVerifyOTP()
        : qr && status === false
        ? handleVerifyOTPAfterScan()
        : handleSubmit;
    }
  };

  const handleClickShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Power function to return value of a ^ b mod P
  const power = (a, b, p) => {
    if (b == 1) return a;
    else return Math.pow(a, b) % p;
  };

  // for handling refresh token
  useEffect(() => {
    userName && autoLogin && handleRefreshToken();
  }, []);

  useEffect(() => {
    if (!autoLogin) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [autoLogin]);

  const handleRefreshToken = () => {
    // unsubscribe to refresh token api when refresh
    const id = localStorage.getItem('refresh_session');
    clearInterval(id);
    const isSuccess = refreshToken();
    if (isSuccess) {
      // Refresh is succesfull so now i am listining for refresh token after some time
      const id = setInterval(() => {
        refreshToken();
      }, 400000);

      localStorage.setItem('refresh_session', id); // on logout i will unsubscribe from refresh token
      ReactDOM.render(<App />, document.getElementById('root'));
    }
  };

  const refreshToken = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      // new FormData()
      // require
      const data = JSON.stringify({
        grant_type: 'refresh_token',

        refresh_token: localStorage.getItem('refresh_token'),
      });
      const login = await (
        await fetch('/auth/refresh-token', {
          method: 'POST',
          headers,
          body: data,
        })
      ).json();
      if (login.message) {
        localStorage.clear();
        sessionStorage.clear();
        setCred({
          ...Cred,
          error: login.message,
        });
        redirectToLogin();
      } // important to clear first because previous logged in might contain some inboxId or imp data
      else if (login.access_token) {
        sessionStorage.setItem('token', login.access_token);
        sessionStorage.setItem('sessionId', login.session_state);
        localStorage.setItem('refresh_token', login.refresh_token);
        localStorage.setItem('expires_in', login.expires_in);
        return true;
      } else {
        redirectToLogin();
      }
    } catch (error) {
      let errMsg = handleError(error.message);
      setCred({
        ...Cred,
        error: errMsg,
      });
      redirectToLogin();
      // dispatch(setSnackbar(true, "error", error));
    }
  };

  const redirectToLogin = () => {
    // unsubscribe to refresh token api when there is an error in it
    const id = localStorage.getItem('refresh_session');
    clearInterval(id);
    localStorage.clear();
    sessionStorage.clear();
    ReactDOM.render(<LoginPage />, document.getElementById('root'));
  };

  return (
    <>
      {props.feedbackdialog ? (
        <Dialog
          className='feedback_dialog'
          fullWidth={true}
          maxWidth='sm'
          aria-labelledby='customized-dialog-title'
          open={open}
        >
          <Feedback
            handleClose={handleClose}
            username={username}
            Authorization={Authorization}
            deptName={deptName}
          />
        </Dialog>
      ) : null}

      {userName && autoLogin ? (
        <>
          <Loading />
        </>
      ) : (
        <div
          className='app'
          style={{
            backgroundImage: `
            linear-gradient(118deg, rgb(88 86 86 / 19%), rgb(73 75 77 / 43%)), url(${window.__ENV__.PUBLIC_URL}/assets/images/clouds.webp)`,
          }}
        >
          <Slide
            direction='up'
            className='sign-in-alert'
            in={Cred.error ? true : false}
            mountOnEnter
            unmountOnExit
          >
            <Alert
              variant='filled'
              severity='error'
              onClose={() => {
                setCred({...Cred, error: false});
              }}
            >
              {Cred.error}
            </Alert>
          </Slide>

          <div
            className='form-animate'
            style={{
              opacity: props.feedbackdialog && open ? 0 : 1,
            }}
          >
            <div className='eoffice-img-Con'>
              <img
                src={
                  window.__ENV__.PUBLIC_URL +
                  '/assets/images/teamsync-white.png'
                }
                alt='teamsync'
                loading='lazy'
              />
              <span>
                {' '}
                Solutions Designed for Your Business eOffice for Government,
                Procurement Automation, Health Records and may more..
              </span>
            </div>
            <form onSubmit={handleSubmit} autoComplete='off'>
              <h4>Sign In</h4>
              {qr === false && (
                <TextField
                  autoComplete='off'
                  required
                  fullWidth
                  InputLabelProps={{
                    style: {color: '#fff'},
                  }}
                  className='inp'
                  size='small'
                  name='username'
                  label='Username'
                  variant='outlined'
                  value={Cred.username}
                  onChange={(e) => {
                    setCred({...Cred, [e.target.name]: e.target.value});
                  }}
                />
              )}
              {qr === false ? (
                <TextField
                  autoComplete='off'
                  required
                  InputLabelProps={{
                    style: {color: '#fff'},
                  }}
                  className='inp'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <Visibility
                              style={{
                                color: '#fe9832',
                              }}
                            />
                          ) : (
                            <VisibilityOff
                              style={{
                                color: '#fe9832',
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  size='small'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  label='Password'
                  variant='outlined'
                  value={Cred.password}
                  onChange={(e) => {
                    setCred({...Cred, [e.target.name]: e.target.value});
                  }}
                />
              ) : qr && status ? (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span style={{margin: '0 5px'}}></span>}
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
                      renderSeparator={<span style={{margin: '0 5px'}}></span>}
                      renderInput={(props) => (
                        <input {...props} className='otp-class' />
                      )}
                    />
                  </div>
                </>
              )}
              {qr && status === false ? (
                <Button
                  fullWidth
                  variant='contained'
                  type='submit'
                  className='sign-in-submit'
                  style={{background: '#fe9832', color: 'white'}}
                  disabled={loading}
                  endIcon={
                    loading ? (
                      <CircularProgress
                        size={20}
                        className='login-disable-btn'
                      />
                    ) : null
                  }
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </Button>
              ) : qr &&
                status ===
                  'OTP already set up. Please use OTP from your Authenticator app to login.' ? (
                <Button
                  fullWidth
                  variant='contained'
                  type='submit'
                  className='sign-in-submit'
                  style={{background: '#fe9832', color: 'white'}}
                  disabled={loading}
                  endIcon={
                    loading ? (
                      <CircularProgress
                        size={20}
                        className='login-disable-btn'
                      />
                    ) : null
                  }
                >
                  {loading ? 'SIGNING IN...' : 'Confirm Otp'}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant='contained'
                  type='submit'
                  className='sign-in-submit'
                  style={{background: '#fe9832', color: 'white'}}
                  disabled={loading}
                  endIcon={
                    loading ? (
                      <CircularProgress
                        size={20}
                        className='login-disable-btn'
                      />
                    ) : null
                  }
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </Button>
              )}
            </form>
            <Avatar className='form-icon'>
              <Lock />
            </Avatar>
            <span className='form-border'></span>
          </div>
        </div>
      )}
    </>
  );
};
export default LoginPage;
