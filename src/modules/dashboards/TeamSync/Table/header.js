import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>UserId</TableCell>
      {/* <TableCell align='left'>Username</TableCell> */}
      {/* <TableCell align='left'>Permissions</TableCell> */}
      <TableCell align='left'>Storage Used</TableCell>
      <TableCell align='center'>Status</TableCell>
    </TableHeader>
  );
};

export default TableHeading;
