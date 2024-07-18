import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../AppLoader';
import Signin from 'modules/userPages/StyledUserPages/Signin';
import {useLocation} from 'react-router-dom';
import Signup from 'modules/userPages/StyledUserPages/Signup';
import ForgetPassword2 from 'modules/userPages/StyledUserPages/ForgetPassword';
import CheckMail from 'modules/userPages/StyledUserPages/CheckMail';
import Verified from 'modules/userPages/StyledUserPages/Verified';
import SetPassword from 'modules/userPages/StyledUserPages/SetPassword';
import VerifiedForgetPass from 'modules/userPages/StyledUserPages/VerifiedForgetpass';
import ConfirmSignupAwsCognito from 'modules/auth/Signup/ConfirmSignupAwsCognito';
import ResetPasswordAwsCognito from 'modules/auth/ForgetPassword/ResetPasswordAwsCognito';

const AppSuspense = (props) => {
  const jwtToken = localStorage.getItem('token');
  let isAuthenticated = false;
  const location = useLocation();

  if (jwtToken) {
    isAuthenticated = true;
    sessionStorage.setItem('isAuthenticated', true);
  } else {
    isAuthenticated = false;
    sessionStorage.setItem('isAuthenticated', false);
  }

  return isAuthenticated ? (
    <React.Suspense fallback={<AppLoader />}>{props.children}</React.Suspense>
  ) : location.pathname === '/signup' ? (
    <Signup />
  ) : location.pathname === '/forgetpassword' ? (
    <ForgetPassword2 />
  ) : location.pathname === '/confirm-signup' ? (
    <ConfirmSignupAwsCognito />
  ) : location.pathname === '/reset-password' ? (
    <ResetPasswordAwsCognito />
  ) : location.pathname === '/check-mail' ? (
    <CheckMail />
  ) : location.pathname.match('/token') ? (
    <Verified />
  ) : location.pathname.match('/reset-password') ? (
    <VerifiedForgetPass />
  ) : location.pathname.match('/set-password') ? (
    <SetPassword />
  ) : (
    <Signin />
  );
};

AppSuspense.propTypes = {
  loadingProps: PropTypes.object,
};

AppSuspense.defaultProps = {
  loadingProps: {
    delay: 300,
  },
};

export default AppSuspense;

AppSuspense.propTypes = {
  children: PropTypes.node.isRequired,
};
