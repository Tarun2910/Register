import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>Course Name</TableCell>
      <TableCell align='left'>Active Start Date</TableCell>
      <TableCell align='left'>Active End Date</TableCell>
      <TableCell align='left'>Coordinator</TableCell>
      <TableCell align='left'></TableCell>
    </TableHeader>
  );
};

export default TableHeading;
