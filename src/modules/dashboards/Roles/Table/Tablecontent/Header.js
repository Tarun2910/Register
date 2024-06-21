import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      {/* <TableCell>Display Username</TableCell> */}
      <TableCell align='left'>Roles</TableCell>
      <TableCell align='left'>Assign User</TableCell>
      <TableCell align='left'>Action</TableCell>
      {/* <TableCell align='left'></TableCell> */}
    </TableHeader>
  );
};

export default TableHeading;
