import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../AppLoader';
import Signin from 'modules/userPages/StyledUserPages/Signin';
import {useLocation} from 'react-router-dom';
import Signup from 'modules/userPages/StyledUserPages/Signup';

const CheckMail = React.lazy(() =>
  import('modules/userPages/StyledUserPages/CheckMail'),
);
const Verified = React.lazy(() =>
  import('modules/userPages/StyledUserPages/Verified'),
);
const VerifiedForgetPass = React.lazy(() =>
  import('modules/userPages/StyledUserPages/VerifiedForgetpass'),
);
const SetPassword = React.lazy(() =>
  import('modules/userPages/StyledUserPages/SetPassword'),
);
const ForgotPassword = React.lazy(() => import('modules/auth/ForgetPassword'));
const ForgetPassword2 = React.lazy(() =>
  import('modules/userPages/StyledUserPages/ForgetPassword'),
);
const ConfirmSignupAwsCognito = React.lazy(() =>
  import('modules/auth/Signup/ConfirmSignupAwsCognito'),
);
const ResetPasswordAwsCognito = React.lazy(() =>
  import('modules/auth/ForgetPassword/ResetPasswordAwsCognito'),
);

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
  ) : location.pathname === '/forget-password' ? (
    <ForgotPassword />
  ) : location.pathname === '/forgetpassword' ? (
    <ForgetPassword2 />
  ) : location.pathname === '/confirm-signup' ? (
    <ConfirmSignupAwsCognito />
  ) : location.pathname === '/reset-password' ? (
    <ResetPasswordAwsCognito />
  ) : location.pathname === '/check-mail' ? (
    <CheckMail />
  ) : location.pathname === '/token/:token' ? (
    <Verified />
  ) : location.pathname === '/reset-password/:token' ? (
    <VerifiedForgetPass />
  ) : location.pathname === '/set-password/:token' ? (
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
