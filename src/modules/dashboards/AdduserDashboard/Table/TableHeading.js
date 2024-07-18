import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton, Tooltip} from '@mui/material';

const TableHeading = ({license, handletiername}) => {
  return (
    <TableHeader>
      <TableCell>
        <Checkbox size='small' sx={{padding: '0px', fontSize: '0.77rem'}} />
      </TableCell>
      <TableCell>
        {/* {`Name ${String(license)} of ${String(handletiername())}`} */} Name
      </TableCell>
      <TableCell align='left'>User Email</TableCell>
      <TableCell align='left'>Manage Storage</TableCell>
      <TableCell align='left'>Active Licence</TableCell>
      <TableCell align='right'>
        <Tooltip title='Activate All' arrow>
          <IconButton size='small' sx={{fontSize: '0.77rem'}}>
            <CheckCircleOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Deactivate All' arrow sx={{fontSize: '0.77rem'}}>
          <IconButton size='small'>
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableHeader>
  );
};

export default TableHeading;

TableHeading.defaultProps = {
  productData: [],
};

TableHeading.propTypes = {
  license: PropTypes.any,
  handletiername: PropTypes.any,
};
