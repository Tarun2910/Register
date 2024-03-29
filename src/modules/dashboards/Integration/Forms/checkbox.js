import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';

const ControlledCheckbox = ({setChecked, checked, handleChange}) => {
  //   const [checked, setChecked] = React.useState(true);

  //   const handleChange = (event) => {
  //     setChecked(event.target.checked);
  //   };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      inputProps={{'aria-label': 'controlled'}}
    />
  );
};

export default ControlledCheckbox;

ControlledCheckbox.propTypes = {
  setChecked: PropTypes.any,
  checked: PropTypes.any,
  handleChange: PropTypes.any,
};
