import React from 'react';
import AppCard from '@crema/components/AppCardOne';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {Divider, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {Fonts} from '@crema/constants/AppEnums';

const LicenseGrid = ({
  cardDetails,
  activeUserCount,
  totalUsersAllowedInLicenseTier,
  licenseExpiry,
}) => {
  console.log(cardDetails, 'cardDetails');
  const {messages} = useIntl();
  return (
    <>
      <AppCard
      // title={messages['dashboard.crypto.cardDetails']}
      // sx={{height: 'auto'}}
      // sxStyle={{height: 'calc(100vh - 330px)'}}
      >
        {/* <Divider
          sx={{
            my: 4,
            borderBottom: (theme) => `solid 2px ${theme.palette.divider}`,
          }}
        /> */}
        {/* <Typography
          sx={{
            fontWeight: Fonts.MEDIUM,
            textAlign: 'start',
            fontSize: 15,
            pb: 1,
            mb: 4,
          }}
        >
          Active User ({activeUserCount}/{totalUsersAllowedInLicenseTier})
        </Typography> */}
        <Box
          sx={{
            fontWeight: Fonts.SEMI_BOLD,
            textAlign: 'start',
            fontSize: 15,
            pb: 1,
          }}
        >
          License Valid Till :- {licenseExpiry}
        </Box>
      </AppCard>
    </>
  );
};

export default LicenseGrid;

LicenseGrid.propTypes = {
  cardDetails: PropTypes.any.isRequired,
  totalUserCount: PropTypes.any.isRequired,
  activeUserCount: PropTypes.any.isRequired,
  inactiveUserCount: PropTypes.any.isRequired,
  pendingUserCount: PropTypes.any.isRequired,
  totalUsersAllowedInLicenseTier: PropTypes.any.isRequired,
  licenseExpiry: PropTypes.any,
};
