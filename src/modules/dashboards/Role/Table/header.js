import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell></TableCell>
      <TableCell align='left'>Department Name</TableCell>
      <TableCell align='left'>Role Name</TableCell>
      <TableCell align='left'>Role Short Name</TableCell>
      <TableCell align='center'>Assigned User</TableCell>
    </TableHeader>
  );
};

export default TableHeading;
