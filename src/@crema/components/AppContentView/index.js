import React from 'react';
import AppFooter from '../AppLayout/components/AppFooter';
import AppErrorBoundary from '../AppErrorBoundary';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppContentViewWrapper from './AppContentViewWrapper';
import AppSuspense from '../AppSuspense';
import './index.css';

const AppContentView = ({sxStyle, routes}) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  console.log(isAuthenticated, 'This');
  return (
    <AppContentViewWrapper>
      <Box
        // sx={{
        //   display: 'flex',
        //   flex: 1,
        //   flexDirection: 'column',
        //   p: {xs: 5, md: 7.5, xl: 12.5},
        //   pt: {xs: 3, md: 3, xl: 3},
        //   ...sxStyle,
        //   backgroundColor: 'red',
        // }}\
        sx={{
          display: 'flex',
          flex: 1,
          background: 'rgba(255, 255, 255, 0.5) none',
          // backgroundImage:
          //   "linear-gradient(90deg, #14466b 39%, #1e728d 60%, #1f9db7 89%)",
          // // transition: "width 0.5s ease",
          backgroundImage:
            window.location.pathname.includes('/signin') ||
            window.location.pathname.includes('/userlogin') ||
            window.location.pathname.includes('/signup')
              ? 'linear-gradient(118deg, rgb(88 86 86 / 19%), rgb(73 75 77 / 43%)),url(/assets/images/sidebar/thumb/loginImg.webp)'
              : // : 'url(/assets/images/sidebar/thumb/backimg.jpg)',
                '',

          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          flexDirection: 'column',
          animationName:
            window.location.pathname.includes('/signin') ||
            window.location.pathname.includes('/userlogin') ||
            window.location.pathname.includes('/signup')
              ? 'cloudMove' // Name of the animation
              : 'none', // No animation if condition not met
          animationDuration: '20s',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',

          p: {xs: 5, md: 7.5, xl: 12.5},
          pt: {xs: 3, md: 3, xl: 3},
          ...sxStyle,
          position: 'absolute', // Ensure it covers the entire viewport
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        className='app-content'
      >
        <AppSuspense>
          <AppErrorBoundary>{routes}</AppErrorBoundary>
        </AppSuspense>
      </Box>
      <AppFooter />
    </AppContentViewWrapper>
  );
};

export default AppContentView;

AppContentView.propTypes = {
  sxStyle: PropTypes.object,
  children: PropTypes.node,
  routes: PropTypes.object.isRequired,
};
