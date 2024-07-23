import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const CustomizedProgressBars = ({
  totalUserCount,
  activeUserCount,
  inactiveUserCount,
  pendingUserCount,
  totalUsersAllowedInLicenseTier,
}) => {
  const activeProgress =
    totalUserCount > 0 ? (activeUserCount / totalUserCount) * 100 : 0;
  const inactiveProgress =
    totalUserCount > 0 ? (inactiveUserCount / totalUserCount) * 100 : 0;
  const pendingProgress =
    totalUserCount > 0 ? (pendingUserCount / totalUserCount) * 100 : 0;

  // Calculate the combined progress percentage
  const combinedProgress = activeProgress + pendingProgress + inactiveProgress;

  return (
    <Stack spacing={2} sx={{flexGrow: 1}}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 5, // Border radius for the combined bar
          overflow: 'hidden', // Hide overflow to maintain border radius
        }}
      >
        {totalUserCount > 0 && (
          <>
            {activeUserCount > 0 && (
              <Box
                sx={{
                  flexGrow: activeProgress,
                  backgroundColor: '#4caf50',
                }}
              >
                <Typography
                  variant='body2'
                  sx={{textAlign: 'center', color: 'white', px: 1}}
                >
                  {activeUserCount} Active
                </Typography>
              </Box>
            )}
            {pendingUserCount > 0 && (
              <Box
                sx={{
                  flexGrow: pendingProgress,
                  backgroundColor: '#ffeb3b',
                }}
              >
                <Typography
                  variant='body2'
                  sx={{textAlign: 'center', color: 'black', px: 1}}
                >
                  {pendingUserCount} Pending
                </Typography>
              </Box>
            )}
            {inactiveUserCount > 0 && (
              <Box
                sx={{
                  flexGrow: inactiveProgress,
                  backgroundColor: '#f44336',
                }}
              >
                <Typography
                  variant='body2'
                  sx={{textAlign: 'center', color: 'white', px: 1}}
                >
                  {inactiveUserCount} Inactive
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant='body2' color='text.secondary'>
          Total: {activeUserCount}/{totalUsersAllowedInLicenseTier}
        </Typography>
      </Box>
    </Stack>
  );
};

CustomizedProgressBars.propTypes = {
  totalUserCount: PropTypes.number.isRequired,
  activeUserCount: PropTypes.number.isRequired,
  inactiveUserCount: PropTypes.number.isRequired,
  pendingUserCount: PropTypes.number.isRequired,
  totalUsersAllowedInLicenseTier: PropTypes.number.isRequired,
};

export default CustomizedProgressBars;
