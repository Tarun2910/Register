// import React from 'react';
// import {CustomizerItemWrapper, StyledToggleButton} from '../index.style';
// import Box from '@mui/material/Box';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import {ThemeMode} from '@crema/constants/AppEnums';
// import clsx from 'clsx';
// import {
//   useThemeActionsContext,
//   useThemeContext,
// } from '@crema/context/AppContextProvider/ThemeContextProvider';
// import {useSidebarActionsContext} from '@crema/context/AppContextProvider/SidebarContextProvider';
// import {DarkSidebar, LightSidebar} from '@crema/constants/defaultConfig';
// import IntlMessages from '@crema/helpers/IntlMessages';

// const ThemeModes = () => {
//   const {updateThemeMode} = useThemeActionsContext();
//   const {updateSidebarColorSet} = useSidebarActionsContext();
//   const {themeMode, theme} = useThemeContext();
//   console.log('themeMode: ', themeMode);

//   const onModeChange = (event, themeMode) => {
//     if (themeMode) {
//       updateThemeMode(themeMode);
//       if (themeMode === ThemeMode.LIGHT) {
//         updateSidebarColorSet({
//           sidebarBgColor: LightSidebar.sidebarBgColor,
//           sidebarTextColor: LightSidebar.sidebarTextColor,
//           sidebarMenuSelectedBgColor: LightSidebar.sidebarMenuSelectedBgColor,
//           sidebarMenuSelectedTextColor:
//             LightSidebar.sidebarMenuSelectedTextColor,
//           sidebarHeaderColor: LightSidebar.sidebarHeaderColor,
//         });
//       } else {
//         updateSidebarColorSet({
//           sidebarBgColor: DarkSidebar.sidebarBgColor,
//           sidebarTextColor: DarkSidebar.sidebarTextColor,
//           sidebarMenuSelectedBgColor: DarkSidebar.sidebarMenuSelectedBgColor,
//           sidebarMenuSelectedTextColor:
//             DarkSidebar.sidebarMenuSelectedTextColor,
//           sidebarHeaderColor: DarkSidebar.sidebarHeaderColor,
//         });
//       }
//     }
//   };

//   return (
//     <CustomizerItemWrapper>
//       <Box component='h4' sx={{mb: 2}}>
//         <IntlMessages id='customizer.themeMode' />
//       </Box>
//       <ToggleButtonGroup
//         value={themeMode}
//         exclusive
//         onChange={onModeChange}
//         aria-label='text alignment'
//       >
//         <StyledToggleButton
//           value={ThemeMode.LIGHT}
//           className={clsx({
//             active: themeMode === ThemeMode.LIGHT,
//           })}
//           aria-label='left aligned'
//         >
//           <IntlMessages id='customizer.light' />
//         </StyledToggleButton>

//         <StyledToggleButton
//           value={ThemeMode.DARK}
//           className={clsx({
//             active:
//               themeMode === ThemeMode.DARK ||
//               theme.palette.type === ThemeMode.DARK,
//           })}
//           aria-label='centered'
//         >
//           <IntlMessages id='customizer.dark' />
//         </StyledToggleButton>
//       </ToggleButtonGroup>
//     </CustomizerItemWrapper>
//   );
// };

// export default ThemeModes;

import React from 'react';
import {IconButton, Box} from '@mui/material';
import PropTypes from 'prop-types';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import {alpha} from '@mui/material/styles';
import {
  useThemeActionsContext,
  useThemeContext,
} from '@crema/context/AppContextProvider/ThemeContextProvider';
import {useSidebarActionsContext} from '@crema/context/AppContextProvider/SidebarContextProvider';
import {DarkSidebar, LightSidebar} from '@crema/constants/defaultConfig';
import {ThemeMode} from '@crema/constants/AppEnums';
import AppTooltip from '../../AppTooltip';

const ThemeModes = () => {
  const {updateThemeMode} = useThemeActionsContext();
  const {updateSidebarColorSet} = useSidebarActionsContext();
  const {themeMode} = useThemeContext();

  const onModeChange = () => {
    const newThemeMode =
      themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    updateThemeMode(newThemeMode);

    if (newThemeMode === ThemeMode.LIGHT) {
      updateSidebarColorSet({
        sidebarBgColor: LightSidebar.sidebarBgColor,
        sidebarTextColor: LightSidebar.sidebarTextColor,
        sidebarMenuSelectedBgColor: LightSidebar.sidebarMenuSelectedBgColor,
        sidebarMenuSelectedTextColor: LightSidebar.sidebarMenuSelectedTextColor,
        sidebarHeaderColor: LightSidebar.sidebarHeaderColor,
      });
    } else {
      updateSidebarColorSet({
        sidebarBgColor: DarkSidebar.sidebarBgColor,
        sidebarTextColor: DarkSidebar.sidebarTextColor,
        sidebarMenuSelectedBgColor: DarkSidebar.sidebarMenuSelectedBgColor,
        sidebarMenuSelectedTextColor: DarkSidebar.sidebarMenuSelectedTextColor,
        sidebarHeaderColor: DarkSidebar.sidebarHeaderColor,
      });
    }
  };

  return (
    <Box>
      <AppTooltip
        title={themeMode === ThemeMode.LIGHT ? 'Dark mode' : 'Light mode'}
        placement='bottom'
      >
        <IconButton
          className='icon-btn'
          sx={{
            borderRadius: '50%',
            width: 40,
            height: 35,
            marginTop: '3px',
            color: (theme) => theme.palette.text.secondary,
            backgroundColor: (theme) => theme.palette.background.default,
            border: 1,
            borderColor: 'transparent',
            '&:hover, &:focus': {
              color: (theme) => theme.palette.text.primary,
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 0.9),
              borderColor: (theme) => alpha(theme.palette.text.secondary, 0.25),
            },
          }}
          onClick={onModeChange}
          size='large'
        >
          {themeMode === ThemeMode.LIGHT ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </AppTooltip>
    </Box>
  );
};

export default ThemeModes;
