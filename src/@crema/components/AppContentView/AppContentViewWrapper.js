import React from 'react';
import PropsTypes from 'prop-types';
import {Box} from '@mui/material';
import './index.css';

const AppContentViewWrapper = ({children, ...rest}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        maxWidth: {xl: 'auto'},
        mx: {xl: 'auto'},
        width: {xl: '100%'},

        backgroundImage:
          window.location.pathname.includes('/signin') ||
          window.location.pathname.includes('/userlogin') ||
          window.location.pathname.includes('/signup') ||
          window.location.pathname.includes('/check-mail') ||
          window.location.pathname.includes('/set-password/:token') ||
          window.location.pathname.includes('/token/:token')
            ? 'linear-gradient(118deg, rgb(88 86 86 / 19%), rgb(73 75 77 / 43%)), url(/assets/images/sidebar/thumb/17973908.jpg)'
            : '',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        animationName:
          window.location.pathname.includes('/signin') ||
          window.location.pathname.includes('/userlogin') ||
          window.location.pathname.includes('/signup') ||
          window.location.pathname.includes('/check-mail') ||
          window.location.pathname.includes('/set-password/:token') ||
          window.location.pathname.includes('/token/:token')
            ? 'cloudMove' // Name of the animation
            : 'none', // No animation if condition not met
        animationDuration: '20s',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default AppContentViewWrapper;

AppContentViewWrapper.propTypes = {
  children: PropsTypes.node,
};
