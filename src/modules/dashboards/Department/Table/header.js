import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>Department</TableCell>
      <TableCell align='left'>Display Name</TableCell>
      <TableCell align='left'>Branch</TableCell>
      <TableCell align='left'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
