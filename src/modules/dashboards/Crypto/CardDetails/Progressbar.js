import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import {Typography} from '@mui/material';
import PropTypes from 'prop-types';

const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function FacebookCircularProgress(props) {
  return (
    <Box sx={{position: 'relative'}}>
      <CircularProgress
        variant='determinate'
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant='indeterminate'
        disableShrink
        sx={{
          color: (theme) =>
            theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id='my_gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#e01cd5' />
            <stop offset='100%' stopColor='#1CB5E0' />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{'svg circle': {stroke: 'url(#my_gradient)'}}} />
    </React.Fragment>
  );
}

const CustomizedProgressBars = ({totalUserCount, activeUserCount}) => {
  const progress =
    totalUserCount > 0 ? (activeUserCount / totalUserCount) * 100 : 0;

  return (
    <Stack spacing={2} sx={{flexGrow: 1}}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <BorderLinearProgress
          variant='determinate'
          value={progress}
          sx={{flexGrow: 1}}
        />
        <Typography variant='body2' color='text.secondary' sx={{ml: 2}}>
          {`${activeUserCount}/${totalUserCount}`}
        </Typography>
      </Box>
    </Stack>
  );
};

CustomizedProgressBars.propTypes = {
  totalUserCount: PropTypes.number.isRequired,
  activeUserCount: PropTypes.number.isRequired,
};

export default CustomizedProgressBars;
