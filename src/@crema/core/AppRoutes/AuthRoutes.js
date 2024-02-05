import React from 'react';

const Signin = React.lazy(() => import('../../../modules/auth/Signin'));
const UserLogin = React.lazy(() => import('../../../modules/auth/Usersigin'));
const Signup = React.lazy(() => import('../../../modules/auth/Signup'));
const ForgotPassword = React.lazy(() =>
  import('../../../modules/auth/ForgetPassword'),
);
const ConfirmSignupAwsCognito = React.lazy(() =>
  import('../../../modules/auth/Signup/ConfirmSignupAwsCognito'),
);
const ResetPasswordAwsCognito = React.lazy(() =>
  import('../../../modules/auth/ForgetPassword/ResetPasswordAwsCognito'),
);
export const authRouteConfig = [
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/userlogin',
    element: <UserLogin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forget-password',
    element: <ForgotPassword />,
  },
  {
    path: '/confirm-signup',
    element: <ConfirmSignupAwsCognito />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordAwsCognito />,
  },
];
