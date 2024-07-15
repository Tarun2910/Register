import * as React from 'react';
import {styled} from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {Tooltip} from '@mui/material';
import PropTypes from 'prop-types';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({theme}) => ({
  width: 34, // Reduced width
  height: 20, // Reduced height
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2, // Adjusted margin for compactness
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(14px)', // Adjusted transform for the new size
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '4px solid #fff', // Adjusted border size
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16, // Reduced thumb width
    height: 16, // Reduced thumb height
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2, // Adjusted border-radius
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export default function CustomizedSwitches({checked, onChange, disabled}) {
  console.log(checked, 'checked');
  return (
    <FormGroup>
      <Tooltip
        title={
          disabled &&
          'You cannot deactivate a previously activated user in the Free Tier'
        }
      >
        <FormControlLabel
          control={
            <IOSSwitch sx={{m: 1}} checked={checked} onChange={onChange} />
          }
          disabled={disabled}
        />
      </Tooltip>
    </FormGroup>
  );
}

CustomizedSwitches.propTypes = {
  checked: PropTypes.any,
  onChange: PropTypes.any,
  disabled: PropTypes.any,
};
