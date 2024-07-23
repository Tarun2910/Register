import React from 'react';
import AppCard from '@crema/components/AppCard';
import CardDetailItem from './CardDetailItem';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import MonthlyLimitItem from './MonthlyLimitItem';
import {Divider, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {Fonts} from '@crema/constants/AppEnums';
import CustomizedProgressBars from './Progressbar';

const CardDetails = ({
  cardDetails,
  activeUserCount,
  totalUserCount,
  inactiveUserCount,
  pendingUserCount,
  totalUsersAllowedInLicenseTier,
}) => {
  console.log(activeUserCount, totalUserCount, 'final');
  const {messages} = useIntl();
  return (
    <>
      <AppCard
        title={messages['dashboard.crypto.cardDetails']}
        sx={{height: 'auto'}}
      >
        <Box
          sx={{
            borderBottom: (theme) => `solid 2px ${theme.palette.divider}`,
            pb: 1,
            mb: 2.5,
          }}
        >
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              mx: -2.5,
            }}
          >
            {cardDetails.cardDetail.map((data, index) => (
              <Box
                sx={{
                  px: 2.5,
                  pb: 1.5,
                }}
                key={index}
              >
                <CardDetailItem cardDetail={data} />
              </Box>
            ))}
          </Box> */}
        </Box>
        {/* <Box
          sx={{
            position: 'relative',
          }}
        >
          <Typography
            sx={{
              color: 'text.secondary',
              mb: 2.5,
            }}
          >
            Storage classification
          </Typography> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mx: -2.5,
            mt: 4,
          }}
        >
          {/* {cardDetails?.map((data, index) => (
            <Box
              sx={{
                px: 2.5,
                pb: 2.5,
              }}
              key={index}
            >
              <MonthlyLimitItem monthlyLimit={data} />
            </Box>
          ))} */}

          {cardDetails ? (
            cardDetails.map((data, index) => (
              <Box
                sx={{
                  px: 2.5,
                  pb: 2.5,
                }}
                key={index}
              >
                <MonthlyLimitItem monthlyLimit={data} />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                py: 5,
              }}
            >
              <Typography>No Record Available</Typography>
            </Box>
          )}
        </Box>
        <Divider
          sx={{
            my: 4,
            borderBottom: (theme) => `solid 2px ${theme.palette.divider}`,
          }}
        />
        <Typography
          sx={{
            fontWeight: Fonts.SEMI_BOLD,
            textAlign: 'start',
            fontSize: 16,
            pb: 1,
            mb: 4,
          }}
        >
          Active User
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          <CustomizedProgressBars
            totalUserCount={totalUserCount}
            activeUserCount={activeUserCount}
            inactiveUserCount={inactiveUserCount}
            pendingUserCount={pendingUserCount}
            totalUsersAllowedInLicenseTier={totalUsersAllowedInLicenseTier}
          />
        </Box>
        {/* </Box> */}
      </AppCard>
    </>
  );
};

export default CardDetails;

CardDetails.propTypes = {
  cardDetails: PropTypes.any.isRequired,
  totalUserCount: PropTypes.any.isRequired,
  activeUserCount: PropTypes.any.isRequired,
  inactiveUserCount: PropTypes.any.isRequired,
  pendingUserCount: PropTypes.any.isRequired,
  totalUsersAllowedInLicenseTier: PropTypes.any.isRequired,
};

// import React from 'react';
// import AppCard from '@crema/components/AppCard';
// import CardDetailItem from './CardDetailItem';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import MonthlyLimitItem from './MonthlyLimitItem';
// import {Divider, Typography} from '@mui/material';
// import {useIntl} from 'react-intl';
// import {Fonts} from '@crema/constants/AppEnums';
// import CustomizedProgressBars from './Progressbar';

// const CardDetailsComponent = ({
//   cardDetails,
//   activeUserCount,
//   totalUserCount,
//   inactiveUserCount,
//   pendingUserCount,
//   totalUsersAllowedInLicenseTier,
// }) => {
//   const {messages} = useIntl();
//   return (
//     <AppCard
//       title={messages['dashboard.crypto.cardDetails']}
//       sx={{height: 'auto'}}
//     >
//       <Box
//         sx={{
//           borderBottom: (theme) => `solid 2px ${theme.palette.divider}`,
//           pb: 1,
//           mb: 2.5,
//         }}
//       >
//         {/* <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             flexWrap: 'wrap',
//             mx: -2.5,
//           }}
//         >
//           {cardDetails.cardDetail.map((data, index) => (
//             <Box
//               sx={{
//                 px: 2.5,
//                 pb: 1.5,
//               }}
//               key={index}
//             >
//               <CardDetailItem cardDetail={data} />
//             </Box>
//           ))}
//         </Box> */}
//       </Box>
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           flexWrap: 'wrap',
//           mx: -2.5,
//           mt: 4,
//         }}
//       >
//         {cardDetails ? (
//           cardDetails.map((data, index) => (
//             <Box
//               sx={{
//                 px: 2.5,
//                 pb: 2.5,
//               }}
//               key={index}
//             >
//               <MonthlyLimitItem monthlyLimit={data} />
//             </Box>
//           ))
//         ) : (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               width: '100%',
//               py: 5,
//             }}
//           >
//             <Typography>No Record Available</Typography>
//           </Box>
//         )}
//       </Box>
//       <Divider
//         sx={{
//           my: 4,
//           borderBottom: (theme) => `solid 2px ${theme.palette.divider}`,
//         }}
//       />
//       <Typography
//         sx={{
//           fontWeight: Fonts.SEMI_BOLD,
//           textAlign: 'start',
//           fontSize: 16,
//           pb: 1,
//           mb: 4,
//         }}
//       >
//         Active User
//       </Typography>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           mb: 2.5,
//         }}
//       >
//         <CustomizedProgressBars
//           totalUserCount={totalUserCount}
//           activeUserCount={activeUserCount}
//           inactiveUserCount={inactiveUserCount}
//           pendingUserCount={pendingUserCount}
//           totalUsersAllowedInLicenseTier={totalUsersAllowedInLicenseTier}
//         />
//       </Box>
//     </AppCard>
//   );
// };

// CardDetailsComponent.propTypes = {
//   cardDetails: PropTypes.any.isRequired,
//   totalUserCount: PropTypes.any.isRequired,
//   activeUserCount: PropTypes.any.isRequired,
//   inactiveUserCount: PropTypes.any.isRequired,
//   pendingUserCount: PropTypes.any.isRequired,
//   totalUsersAllowedInLicenseTier: PropTypes.any.isRequired,
// };

// const CardDetails = React.memo(CardDetailsComponent);
// CardDetails.displayName = 'CardDetails';

// export default CardDetails;
