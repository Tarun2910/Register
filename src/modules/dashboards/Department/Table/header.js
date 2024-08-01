import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';
import {TableSortLabel} from '@mui/material';
import PropTypes from 'prop-types';

const TableHeading = ({sortOrder, onSort}) => {
  const handleSort = () => {
    let newSortOrder = '';
    if (sortOrder === '') {
      newSortOrder = 'asc';
    } else if (sortOrder === 'asc') {
      newSortOrder = 'desc';
    } else {
      newSortOrder = '';
    }
    onSort(newSortOrder);
  };
  return (
    <TableHeader>
      <TableCell></TableCell>
      <TableCell align='left'>
        <TableSortLabel
          active={sortOrder !== ''}
          direction={sortOrder === '' ? 'asc' : sortOrder}
          onClick={handleSort}
        >
          Department Name
        </TableSortLabel>
      </TableCell>
      <TableCell align='left'>Department Short Name</TableCell>
      <TableCell align='left'>Branch</TableCell>
      <TableCell align='center'>Manage Storage</TableCell>
      {/* <TableCell></TableCell> */}
    </TableHeader>
  );
};

export default TableHeading;

TableHeading.defaultProps = {
  productData: [],
};

TableHeading.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
};
