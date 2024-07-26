import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import PropTypes from 'prop-types';

const AppTableContainer = ({children, sxStyle}) => {
  return (
    <TableContainer
      sx={{
        '& tr > th, & tr > td': {
          whiteSpace: 'nowrap',
        },
        ...sxStyle,
      }}
      // sx={{
      //   maxHeight: 600, // Adjust the height as needed
      //   overflowY: 'hidden',
      //   display: 'block',
      //   '& th': {
      //     position: 'sticky',
      //     top: 0,
      //     zIndex: 1,
      //     backgroundColor: '#fff', // Ensure header has a background
      //   },
      //   '& tr > th, & tr > td': {
      //     whiteSpace: 'nowrap',
      //   },
      //   ...sxStyle,
      // }}
    >
      {children}
    </TableContainer>
  );
};

export default AppTableContainer;

AppTableContainer.propTypes = {
  children: PropTypes.node,
  sxStyle: PropTypes.object,
};
