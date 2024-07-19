import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell></TableCell>
      <TableCell align='left'>Department Name</TableCell>
      <TableCell align='left'>Department Short Name</TableCell>
      <TableCell align='left'>Branch</TableCell>
      <TableCell align='center'>Manage Storage</TableCell>
      <TableCell></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
