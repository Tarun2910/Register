import React from 'react';

const Signin = React.lazy(() => import('../../../modules/auth/Signin'));
const CheckMail = React.lazy(() =>
  import('../../../modules/userPages/StyledUserPages/CheckMail'),
);
const Verified = React.lazy(() =>
  import('../../../modules/userPages/StyledUserPages/Verified'),
);
const VerifiedForgetPass = React.lazy(() =>
  import('../../../modules/userPages/StyledUserPages/VerifiedForgetpass'),
);
const SetPassword = React.lazy(() =>
  import('../../../modules/userPages/StyledUserPages/SetPassword'),
);
const UserLogin = React.lazy(() => import('../../../modules/auth/Usersigin'));
const Signup = React.lazy(() => import('../../../modules/auth/Signup'));
const ForgotPassword = React.lazy(() =>
  import('../../../modules/auth/ForgetPassword'),
);
const ForgetPassword2 = React.lazy(() =>
  import('../../../modules/userPages/StyledUserPages/ForgetPassword'),
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
    path: '/forgetpassword',
    element: <ForgetPassword2 />,
  },
  {
    path: '/confirm-signup',
    element: <ConfirmSignupAwsCognito />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordAwsCognito />,
  },
  {
    path: '/check-mail',
    element: <CheckMail />,
  },
  {
    path: `/token/:token`,
    element: <Verified />,
  },
  {
    path: `/reset-password/:token`,
    element: <VerifiedForgetPass />,
  },
  {
    path: `/set-password/:token`,
    element: <SetPassword />,
  },
];
