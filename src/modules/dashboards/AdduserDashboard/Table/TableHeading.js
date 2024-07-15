import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>Name</TableCell>
      <TableCell align='left'>User Email</TableCell>
      {/* <TableCell align='left'>Username</TableCell> */}
      <TableCell align='left'>Active Licence</TableCell>
      <TableCell align='right'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
