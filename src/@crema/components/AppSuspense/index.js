import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../AppLoader';
import Signin from 'modules/userPages/StyledUserPages/Signin';
import {useLocation} from 'react-router-dom';
import Signup from 'modules/userPages/StyledUserPages/Signup';

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
