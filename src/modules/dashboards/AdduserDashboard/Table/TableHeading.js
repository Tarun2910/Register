import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';

const TableHeading = ({license, handletiername}) => {
  return (
    <TableHeader>
      <TableCell>
        <Checkbox size='small' sx={{padding: '0px', fontSize: '0.77rem'}} />
      </TableCell>
      <TableCell>
        {/* {`Name ${String(license)} of ${String(handletiername())}`} */} Name
      </TableCell>
      <TableCell align='left'>User Email</TableCell>
      <TableCell align='left'>Manage Storage</TableCell>
      <TableCell align='left'>Active Licence</TableCell>
      <TableCell align='right'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;

TableHeading.defaultProps = {
  productData: [],
};

TableHeading.propTypes = {
  license: PropTypes.any,
  handletiername: PropTypes.any,
};
