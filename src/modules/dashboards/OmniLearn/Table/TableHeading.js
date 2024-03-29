import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>User Name</TableCell>
      <TableCell align='left'>User Email</TableCell>
      <TableCell align='left'>Status</TableCell>
      <TableCell align='left'>Assign Role</TableCell>
      {/* <TableCell align='left'></TableCell> */}
    </TableHeader>
  );
};

export default TableHeading;
