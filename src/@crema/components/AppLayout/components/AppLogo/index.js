import React from 'react';
import {Box} from '@mui/material';
import {useThemeContext} from '@crema/context/AppContextProvider/ThemeContextProvider';
import {alpha} from '@mui/material/styles';
import {ReactComponent as Logo} from '../../../../../assets/icon/logo.svg';
// import pic from '../../../assets/user/access-arc-05.png';
import pic from '../../../../../../src/assets/user/access-arc-05.png';
import {ReactComponent as LogoText} from '../../../../../assets/icon/logo_text.svg';
// import {ReactComponent as Kms} from '../../../../../assets/icon/trace.svg';
import Kms from '../../../../../../src/assets/icon/kms imge.png';

const AppLogo = () => {
  const {theme} = useThemeContext();
  return (
    <Box
      sx={{
        height: {xs: 56, sm: 70},
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          height: {xs: 40, sm: 45},
          width: '13rem',
        },
      }}
      className='app-logo'
    >
      {/* <Logo fill={theme.palette.primary.main} /> */}
      <img
        src={pic}
        style={{width: '13rem', maxWidth: '100%', height: 'auto'}}
      />
      <Box
        sx={{
          mt: 1,
          display: {xs: 'none', md: 'block'},
          '& svg': {
            height: {xs: 25, sm: 30},
          },
        }}
      >
        {/* <Kms fill={alpha(theme.palette.text.primary, 0.8)} /> */}
        <h1></h1>
        {/* <LogoText fill={alpha(theme.palette.text.primary, 0.8)} /> */}
      </Box>
    </Box>
  );
};

export default AppLogo;
