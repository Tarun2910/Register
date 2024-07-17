import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell></TableCell>
      <TableCell align='center'>Role Name</TableCell>
      <TableCell align='center'>Role Short Name</TableCell>
      <TableCell align='center'>Assigned User</TableCell>
      <TableCell align='center'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
