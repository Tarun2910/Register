import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AppLngSwitcher from '../../../AppLngSwitcher';
import Box from '@mui/material/Box';
import AppSearchBar from '../../../AppSearchBar';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppMessages from '../../../AppMessages';
import AppNotifications from '../../../AppNotifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppTooltip from '../../../AppTooltip';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import AppLogo from '../../components/AppLogo';
import {allowMultiLanguage} from '../../../../constants/AppConst';
import {useAuthMethod} from '@crema/hooks/AuthHooks';
import LogoutIcon from '@mui/icons-material/Logout';

const AppHeader = (props) => {
  const {isCollapsed, setCollapsed, toggleNavCollapsed} = props;
  const {logout} = useAuthMethod();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position='relative'
      color='inherit'
      sx={{
        // boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        transition: 'width 0.5s ease',
        width: '100%',
        // background:
        //   'linear-gradient(to right bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2))',
        // backdropFilter: 'blur(1rem)',
        boxShadow: '0 0 1rem rgba(0, 0, 0, 0.2)',
      }}
      className='app-bar'
    >
      <Toolbar
        sx={{
          boxSizing: 'border-box',
          minHeight: {xs: 56, sm: 70},
          paddingLeft: {xs: 5},
          paddingRight: {xs: 5, md: 7.5},
        }}
      >
        <Hidden lgDown>
          <IconButton
            sx={{color: 'text.secondary'}}
            edge='start'
            className='menu-btn'
            color='inherit'
            aria-label='open drawer'
            onClick={() => setCollapsed(!isCollapsed)}
            size='large'
          >
            <MenuIcon
              sx={{
                width: 35,
                height: 35,
              }}
            />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            sx={{color: 'text.secondary'}}
            edge='start'
            className='menu-btn'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleNavCollapsed}
            size='large'
          >
            <MenuIcon
              sx={{
                width: 35,
                height: 35,
              }}
            />
          </IconButton>
        </Hidden>
        <Box
          sx={{
            '& .logo-text': {
              display: {xs: 'none', sm: 'block'},
            },
          }}
        >
          <AppLogo />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
          }}
        />
        <Box
          sx={{
            minHeight: 40,
            position: 'relative',
            '& .searchRoot': {
              position: {xs: 'absolute', sm: 'relative'},
              right: {xs: 0, sm: 'auto'},
              top: {xs: 0, sm: 'auto'},
            },
          }}
        >
          <AppSearchBar iconPosition='right' placeholder='Search…' />
        </Box>

        {allowMultiLanguage && (
          <Box sx={{ml: 4}}>
            <AppLngSwitcher iconOnly={true} tooltipPosition='bottom' />
          </Box>
        )}

        <Box sx={{ml: 4}}>
          <Hidden smDown>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginLeft: -2,
                marginRight: -2,
              }}
            >
              <Box
                sx={{
                  px: 1.85,
                }}
              >
                <AppNotifications />
              </Box>
              {/* <Box
                sx={{
                  px: 1.85,
                }}
              >
                <AppMessages />
              </Box> */}
              <Box
                sx={{
                  px: 1.85,
                }}
              >
                <LogoutIcon onClick={logout} />
              </Box>
            </Box>
          </Hidden>

          <Hidden smUp>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginLeft: -2,
                marginRight: -2,
              }}
            >
              <Box
                sx={{
                  px: 1.85,
                }}
              >
                <AppTooltip title='More'>
                  <IconButton
                    sx={{
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      color: (theme) => theme.palette.text.secondary,
                      backgroundColor: (theme) =>
                        theme.palette.background.default,
                      border: 1,
                      borderColor: 'transparent',
                      '&:hover, &:focus': {
                        color: (theme) => theme.palette.text.primary,
                        backgroundColor: (theme) =>
                          alpha(theme.palette.background.default, 0.9),
                        borderColor: (theme) =>
                          alpha(theme.palette.text.secondary, 0.25),
                      },
                    }}
                    onClick={handleClick}
                    size='large'
                  >
                    <MoreVertIcon />
                  </IconButton>
                </AppTooltip>
              </Box>
            </Box>
          </Hidden>
          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <AppNotifications isMenu />
            </MenuItem>
            <MenuItem>
              <AppMessages isMenu />
            </MenuItem>
            <MenuItem>Setting</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default AppHeader;

AppHeader.propTypes = {
  isCollapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
  toggleNavCollapsed: PropTypes.func,
};
