// import React from 'react';
// import {alpha, Box, Typography} from '@mui/material';
// import PropTypes from 'prop-types';
// import {Fonts} from '@crema/constants/AppEnums';
// import AppCircularProgress from '@crema/components/AppCircularProgress';

// const MonthlyLimitItem = ({monthlyLimit}) => {
//   console.log(monthlyLimit, 'll');
//   return (
//     <Box
//       sx={{
//         position: 'relative',
//       }}
//     >
//       <Box
//         sx={{
//           mb: 1.5,
//         }}
//       >
//         <AppCircularProgress
//           pathColor={alpha(monthlyLimit.activeColor, 0.1)}
//           value={monthlyLimit.value}
//           activeColor={monthlyLimit.activeColor}
//           thickness={3}
//           minWidth={115}
//           maxWidth={125}
//           valueStyle={{
//             color: (theme) => theme.palette.text.primary,
//             fontWeight: Fonts.BOLD,
//             fontSize: 24,
//           }}
//         />
//       </Box>
//       <Box
//         sx={{
//           textAlign: 'center',
//         }}
//       >
//         <Typography
//           sx={{
//             fontWeight: Fonts.BOLD,
//           }}
//         >
//           {monthlyLimit.title}
//         </Typography>
//         <Typography
//           sx={{
//             color: 'text.secondary',
//           }}
//         >
//           {monthlyLimit.income}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default MonthlyLimitItem;

// MonthlyLimitItem.propTypes = {
//   monthlyLimit: PropTypes.object.isRequired,
// };

import React from 'react';
import {alpha, Box, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import {Fonts} from '@crema/constants/AppEnums';
import AppCircularProgress from '@crema/components/AppCircularProgress';
import {useNavigate} from 'react-router-dom';

const MonthlyLimitItem = ({monthlyLimit}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (monthlyLimit.title === 'Departments') {
      navigate('/department');
    } else if (monthlyLimit.title === 'Users') {
      navigate('/user');
    }
  };

  const isClickable =
    monthlyLimit.title === 'Departments' || monthlyLimit.title === 'Users';
  const textColor = isClickable ? 'primary.main' : 'text.primary';

  return (
    <Box
      sx={{
        position: 'relative',
        cursor:
          monthlyLimit.title === 'Departments' || monthlyLimit.title === 'Users'
            ? 'pointer'
            : 'default',
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          mb: 1.5,
        }}
      >
        <AppCircularProgress
          pathColor={alpha(monthlyLimit.activeColor, 0.1)}
          value={monthlyLimit.value}
          activeColor={monthlyLimit.activeColor}
          thickness={3}
          minWidth={115}
          maxWidth={125}
          valueStyle={{
            color: (theme) => theme.palette.text.primary,
            fontWeight: Fonts.BOLD,
            fontSize: 24,
          }}
        />
      </Box>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: Fonts.BOLD,
            color: textColor,
          }}
        >
          {monthlyLimit.title}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
          }}
        >
          {monthlyLimit.income}
        </Typography>
      </Box>
    </Box>
  );
};

export default MonthlyLimitItem;

MonthlyLimitItem.propTypes = {
  monthlyLimit: PropTypes.shape({
    activeColor: PropTypes.string.isRequired,
    income: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
};
