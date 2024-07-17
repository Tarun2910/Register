import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';
import Checkbox from '@mui/material/Checkbox';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>
        <Checkbox sx={{padding: '0px', fontSize: '0.77rem'}} />
      </TableCell>
      <TableCell>Name</TableCell>
      <TableCell align='left'>User Email</TableCell>
      <TableCell align='left'>Manage Storage</TableCell>
      <TableCell align='left'>Active Licence</TableCell>
      <TableCell align='right'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
