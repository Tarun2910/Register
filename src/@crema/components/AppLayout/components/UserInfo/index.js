// import React from 'react';
// import orange from '@mui/material/colors/orange';
// import {Box} from '@mui/material';
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import {Fonts} from '@crema/constants/AppEnums';
// import {useNavigate} from 'react-router-dom';
// import PropTypes from 'prop-types';
// import {useAuthMethod, useAuthUser} from '@crema/hooks/AuthHooks';
// import {blue} from '@mui/material/colors';

// const UserInfo = ({color}) => {
//   const {logout} = useAuthMethod();
//   const {user} = useAuthUser();
//   const navigate = useNavigate();

//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const username = sessionStorage.getItem('username');

//   const getUserAvatar = () => {
//     if (username) {
//       return username.charAt(0).toUpperCase();
//     }
//     if (user?.displayName) {
//       return user.displayName.charAt(0).toUpperCase();
//     }
//     if (user?.email) {
//       return user.email.charAt(0).toUpperCase();
//     }
//     return 'U'; // Default letter if no username, displayName, or email is found
//   };

//   return (
//     <>
//       <Box
//         onClick={handleClick}
//         sx={{
//           py: 3,
//           px: 3,
//           display: 'flex',
//           alignItems: 'center',
//           cursor: 'pointer',
//         }}
//         className='user-info-view'
//       >
//         <Box sx={{py: 0.5}}>
//           {user?.photoURL ? (
//             <Avatar
//               sx={{
//                 height: 40,
//                 width: 40,
//                 fontSize: 24,
//                 backgroundColor: blue[500],
//               }}
//               src={''}
//             />
//           ) : (
//             <Avatar
//               sx={{
//                 height: 40,
//                 width: 40,
//                 fontSize: 24,
//                 backgroundColor: orange[500],
//               }}
//             >
//               {getUserAvatar()}
//             </Avatar>
//           )}
//         </Box>
//         <Box
//           sx={{
//             width: {xs: 'calc(100% - 62px)', xl: 'calc(100% - 72px)'},
//             ml: 4,
//             color: color,
//           }}
//           className='user-info'
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Box
//               sx={{
//                 mb: 0,
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 whiteSpace: 'nowrap',
//                 fontSize: 16,
//                 fontWeight: Fonts.MEDIUM,
//                 color: 'inherit',
//               }}
//               component='span'
//             >
//               {username || user?.displayName || 'Tarun Sharma'}
//             </Box>
//             {/* <Box
//               sx={{
//                 ml: 3,
//                 color: 'inherit',
//                 display: 'flex',
//               }}
//             >
//               <ExpandMoreIcon />
//             </Box> */}
//           </Box>
//           <Box
//             sx={{
//               mt: -0.5,
//               textOverflow: 'ellipsis',
//               whiteSpace: 'nowrap',
//               color: 'inherit',
//             }}
//           >
//             Administrator
//           </Box>
//         </Box>
//       </Box>
//       {/* <Menu
//         id='simple-menu'
//         anchorEl={anchorEl}
//         keepMounted
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MenuItem
//           onClick={() => {
//             handleClose();
//             navigate('/my-profile');
//           }}
//         >
//           My account
//         </MenuItem>
//         <MenuItem onClick={logout}>Logout</MenuItem>
//       </Menu> */}
//     </>
//   );
// };

// export default UserInfo;

// UserInfo.defaultProps = {
//   color: 'text.secondary',
// };

// UserInfo.propTypes = {
//   color: PropTypes.string,
// };

import React from 'react';
import orange from '@mui/material/colors/orange';
import {Box} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {blue} from '@mui/material/colors';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {useAuthMethod, useAuthUser} from '@crema/hooks/AuthHooks';

const UserInfo = ({color}) => {
  const {logout} = useAuthMethod();
  const {user} = useAuthUser();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const username = sessionStorage.getItem('AdminName');

  const getUserAvatar = () => {
    if (username) {
      return username
        .split(' ') // Split the name into an array of words
        .map((word) => word.charAt(0).toUpperCase()) // Get the first letter of each word and convert to uppercase
        .join('');
    }
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Default letter if no username, displayName, or email is found
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          py: 3,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          // cursor: 'pointer',
        }}
        className='user-info-view'
      >
        <Box sx={{py: 0.5}}>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              fontSize: 24,
              backgroundColor: user?.photoURL ? blue[500] : orange[500],
            }}
          >
            {getUserAvatar()}
          </Avatar>
        </Box>
        <Box
          sx={{
            width: {xs: 'calc(100% - 62px)', xl: 'calc(100% - 72px)'},
            ml: 4,
            color: color,
          }}
          className='user-info'
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                mb: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 16,
                fontWeight: 'bold', // Use a constant value for boldness
                color: 'inherit',
              }}
              component='span'
            >
              {username}
            </Box>
          </Box>
          <Box
            sx={{
              mt: -0.5,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'inherit',
            }}
          >
            Administrator
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserInfo;

UserInfo.defaultProps = {
  color: 'text.secondary',
};

UserInfo.propTypes = {
  color: PropTypes.string,
};
