import React, {useState} from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import {toast} from 'react-toastify';
import {AiOutlineCheckCircle, AiOutlineCloseCircle} from 'react-icons/ai';
import FilterListIcon from '@mui/icons-material/FilterList';

const TableHeading = ({
  license,
  handletiername,
  selectedUsers,
  setToggleStatus,
  setSelectedUsers,
  productData,
  setLoading,
  onSort,
  sortOrder,
  setFilter,
  filter,
}) => {
  console.log(selectedUsers, 'selectedUsers');
  const appName = 'TeamSync';
  const iconSize = 20;
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  const handleToggleActive = (activate) => {
    setLoading(true);
    const newActiveStatus = activate; // Set active status to the desired value (true or false)
    const applicationName = 'TeamSync';

    // Prepare an array of requests to update each user
    const requests = selectedUsers.map((user) => ({
      id: user.id,
      active: newActiveStatus,
    }));

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users/status?appName=${applicationName}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: requests,
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setToggleStatus((prevStatus) => !prevStatus);
          setSelectedUsers([]);
          toast.success('Users active status updated successfully.');
        } else {
          setLoading(false);
          toast.error('Failed to update users active status.');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error updating users:', error);
      });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(productData);
    } else {
      setSelectedUsers([]);
    }
  };

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

  // Determine if all selected users are active
  const allActive = selectedUsers.every((user) => user.active);
  // Determine if all selected users are inactive
  const allInactive = selectedUsers.every((user) => !user.active);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (value) => {
    setFilter(value);
    handleFilterClose();
  };
  return (
    <TableHeader>
      <TableCell>
        {/* <Checkbox
          size='small'
          sx={{padding: '0px', fontSize: '0.77rem'}}
          onChange={handleSelectAll}
          checked={selectedUsers.length === productData.length}
        /> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'primary.main',
          }}
        >
          <Checkbox
            size='small'
            checked={selectedUsers.length === productData.length}
            onChange={handleSelectAll}
          />
        </Box>
      </TableCell>
      <TableCell>
        {/* {`Name ${String(license)} of ${String(handletiername())}`} Name */}

        <TableSortLabel
          active={sortOrder !== ''}
          direction={sortOrder === '' ? 'asc' : sortOrder}
          onClick={handleSort}
        >
          Name
        </TableSortLabel>
      </TableCell>
      <TableCell align='left'>User Email</TableCell>
      <TableCell align='left'>Storage Used</TableCell>
      <TableCell align='left'>Manage Storage</TableCell>
      <TableCell align='left' sx={{width: '150px', whiteSpace: 'nowrap'}}>
        Active License
        <Box component='span' sx={{ml: 2}}>
          <IconButton
            size='small'
            onClick={handleFilterClick}
            sx={{
              marginLeft: '5px',
              padding: '0px',
              color: 'primary.main',
              marginRight: '1rem',
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
              onClick={() => handleFilterSelect('all')}
              selected={filter === 'all'}
            >
              ALL
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('active')}
              selected={filter === 'active'}
            >
              ACTIVE
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('inactive')}
              selected={filter === 'inactive'}
            >
              INACTIVE
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect('pendiing')}
              selected={filter === 'pending'}
            >
              PENDING
            </MenuItem>
          </Menu>
          <Tooltip title='Activate Selected' arrow>
            <IconButton
              size='small'
              sx={{fontSize: iconSize, padding: '0px', color: 'green'}}
              onClick={() => handleToggleActive(true)}
              disabled={selectedUsers.length === 0}
            >
              <AiOutlineCheckCircle />
            </IconButton>
          </Tooltip>
          <Tooltip
            title='Deactivate Selected'
            arrow
            sx={{fontSize: iconSize, padding: '0px', color: 'red'}}
          >
            <IconButton
              size='small'
              onClick={() => handleToggleActive(false)}
              disabled={selectedUsers.length === 0}
            >
              <AiOutlineCloseCircle />
            </IconButton>
          </Tooltip>
        </Box>
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
  selectedUsers: PropTypes.any,
  setToggleStatus: PropTypes.any,
  setSelectedUsers: PropTypes.any,
  productData: PropTypes.any,
  setLoading: PropTypes.any,
  onSort: PropTypes.func.isRequired,
  sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
  setFilter: PropTypes.any,
  filter: PropTypes.any,
};
