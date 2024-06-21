import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>Department Name</TableCell>
      <TableCell align='left'>Role Name</TableCell>
      {/* <TableCell align='left'>Roles</TableCell> */}
      <TableCell align='left'>Assigned User</TableCell>
      <TableCell align='left'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
