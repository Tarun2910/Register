import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>Department</TableCell>
      <TableCell align='left'>Display Username</TableCell>
      <TableCell align='left'>Branch</TableCell>
      <TableCell align='left'>CAU</TableCell>
      <TableCell align='left'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
