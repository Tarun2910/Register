import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>Username</TableCell>
      <TableCell align='left'>Role Assigned</TableCell>
      <TableCell align='left'>Managed By</TableCell>
      <TableCell align='left'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
