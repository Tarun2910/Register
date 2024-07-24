import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';
import {Box, IconButton, Menu, MenuItem} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList'; // Import the filter icon here

const TableHeading = ({
  showUsers,
  setShowUsers,
  filterStatus,
  setFilterStatus,
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (value) => {
    setFilterStatus(value);
    handleFilterClose();
  };

  return (
    <TableHeader>
      <TableCell align='left'>
        <>
          {/* Departments - Initially disabled */}
          <Box
            component='span'
            onClick={() => !showUsers && setShowUsers(true)}
            sx={{
              // marginLeft: '10px',
              color: showUsers ? 'text.secondary' : 'primary.main',
              cursor: showUsers ? 'default' : 'pointer',
              fontWeight: showUsers ? 'normal' : 'bold',
            }}
          >
            Users
          </Box>
          <Box component='span' sx={{marginLeft: '10px'}}>
            /
          </Box>

          {/* Users - Initially enabled and clickable */}
          <Box
            component='span'
            onClick={() => showUsers && setShowUsers(false)}
            sx={{
              marginLeft: '10px',
              color: showUsers ? 'primary.main' : 'text.secondary',
              cursor: !showUsers ? 'default' : 'pointer',
              fontWeight: showUsers ? 'bold' : 'normal',
            }}
          >
            Departments
          </Box>
        </>
      </TableCell>
      <TableCell align='left'>Storage Used</TableCell>
      <TableCell align='left'>Storage Assigned</TableCell>
      {showUsers && (
        <TableCell align='center'>
          {/* <Box display='flex' alignItems='center'> */}
          Status
          <IconButton
            size='small'
            onClick={handleFilterClick}
            sx={{
              marginLeft: '5px',
              padding: '0px',
              color: 'primary.main',
            }}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={isFilterMenuOpen}
            onClose={handleFilterClose}
          >
            <MenuItem
              onClick={() => handleFilterSelect('ALL')}
              selected={filterStatus === 'ALL'}
            >
              ALL
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('ACTIVE')}
              selected={filterStatus === 'ACTIVE'}
            >
              ACTIVE
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('INACTIVE')}
              selected={filterStatus === 'INACTIVE'}
            >
              INACTIVE
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('PENDING')}
              selected={filterStatus === 'PENDING'}
            >
              PENDING
            </MenuItem>
          </Menu>
          {/* </Box> */}
        </TableCell>
      )}
    </TableHeader>
  );
};

TableHeading.propTypes = {
  showUsers: PropTypes.bool.isRequired,
  setShowUsers: PropTypes.func.isRequired,
  filterStatus: PropTypes.string.isRequired,
  setFilterStatus: PropTypes.func.isRequired,
};

export default TableHeading;
