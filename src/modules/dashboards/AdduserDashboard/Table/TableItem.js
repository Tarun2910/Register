import React, {useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {ellipsisLines} from '@crema/helpers/StringHelper';
import CustomizedSwitches from './switchButton';
import OrderActions from './Actions';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: '0.77rem',
  padding: 4,
  '&:first-of-type': {
    paddingLeft: 20,
  },
  '&:last-of-type': {
    paddingRight: 20,
  },
}));

const TableItem = ({
  productData,
  onItemsStateUpdate,
  onButtonDisable,
  setTableData,
  itemsState,
  setItemsState,
  setList,
  setSelectedUsers,
  selectedUsers,
}) => {
  let licenceTier = sessionStorage.getItem('licenceTierTeamsync');

  useEffect(() => {
    // Initialize itemsState with default values from productData
    const initialItemsState = productData.map((data) => ({
      id: data.id,
      active: data.active,
    }));
    setTableData(initialItemsState);
  }, [itemsState]);

  useEffect(() => {
    // Call the callback function to send the updated state to the parent
    onItemsStateUpdate(itemsState);
    // if (itemsState.length <= 0) {
    //   onButtonDisable(true);
    // } else {
    //   onButtonDisable(false);
    // }
    console.log(itemsState, productData, 'productData');
    const isAnyItemInactive = itemsState.some(
      (item) =>
        item.active !== productData.find((d) => d.id === item.id).active,
    );

    if (isAnyItemInactive) {
      onButtonDisable(false);
    } else {
      onButtonDisable(true);
    }
  }, [itemsState, onItemsStateUpdate]);

  const handleSwitchChange = (data) => {
    const id = data.id;
    const itemIndex = itemsState.findIndex((item) => item.id === id);
    const isActive = itemsState ? itemsState.active : data.active;

    setItemsState((prevItemsState) => {
      const updatedItemsState = [...prevItemsState];

      if (itemIndex !== -1) {
        // If the item is already in the state, update only the specific item
        updatedItemsState[itemIndex].active =
          !updatedItemsState[itemIndex].active;
      } else {
        // If the item is not in the state, add it to the state
        updatedItemsState.push({id, active: !data.active});
      }

      return updatedItemsState;
    });
  };

  console.log(itemsState, 'itemsState');
  const adminName = sessionStorage.getItem('AdminName');
  console.log(adminName, 'adminName');

  const handleChange = (userId, field, newValue) => {
    console.log(userId, field, newValue);
    if (field === 'allowedStorageInBytesDisplay') {
      let totalBytes;
      let valueArr = newValue?.split(' ');
      if (valueArr[1] === 'GB') {
        totalBytes = parseFloat(valueArr[0]) * 1024 * 1024 * 1024;
      } else {
        totalBytes = valueArr[0] * 1024 * 1024;
      }
      const newArr = productData.map((user) =>
        user.id === userId
          ? {...user, [field]: newValue, allowedStorageInBytes: totalBytes}
          : user,
      );
      setList(newArr);
    } else {
      const newArr = productData.map((user) =>
        user.id === userId ? {...user, [field]: newValue} : user,
      );
      setList(newArr);
    }
  };
  console.log(sessionStorage.getItem('licenceTierTeamsync'));
  let disable = sessionStorage.getItem('licenceTierTeamsync');
  const disableStorage = () => {
    if (disable == 'TRIAL') {
      return true;
    } else {
      return false;
    }
  };
  console.log(productData, 'ggproductData');

  const handleCheckboxChange = (data) => {
    setSelectedUsers((prevSelectedUsers) => {
      const isSelected = prevSelectedUsers.some((user) => user.id === data.id);
      if (isSelected) {
        return prevSelectedUsers.filter((user) => user.id !== data.id);
      } else {
        return [...prevSelectedUsers, data];
      }
    });
  };

  return productData.map((data) => (
    <TableRow key={data.id} className='item-hover'>
      <StyledTableCell>
        <Checkbox
          size='small'
          sx={{padding: '0px', fontSize: '0.77rem'}}
          checked={selectedUsers.some((user) => user.id === data.id)}
          onChange={() => handleCheckboxChange(data)}
        />
      </StyledTableCell>
      <StyledTableCell align='left'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {data.name === adminName ? `${data.name} (Admin)` : data.name}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data.email}</StyledTableCell>
      <StyledTableCell align='left'>
        {' '}
        <Tooltip
          title={
            disable == 'TRIAL' && `In free Tier You Can't Change the Storage`
          }
        >
          <FormControl
            variant='outlined'
            style={{minWidth: 120, padding: '0px'}}
            size='small'
          >
            <InputLabel>STORAGE</InputLabel>
            <Select
              label='STORAGE'
              value={data?.permissions?.allowedStorageInBytesDisplay}
              // disabled={disable == 'TRIAL'}
              onChange={(event) =>
                handleChange(
                  data?.permissions?.id,
                  'allowedStorageInBytesDisplay',
                  event.target.value,
                )
              }
            >
              <MenuItem value='' disabled>
                Select Storage
              </MenuItem>
              <MenuItem value='200.00 MB'>200 MB</MenuItem>
              <MenuItem value='400.00 MB'>400 MB</MenuItem>
              <MenuItem value='600.00 MB'>600 MB</MenuItem>
              <MenuItem value='800.00 MB'>800 MB</MenuItem>
              <MenuItem value='1.00 GB'>1 GB</MenuItem>
              <MenuItem value='1.20 GB'>1.2 GB</MenuItem>
              <MenuItem value='1.40 GB'>1.4 GB</MenuItem>
              <MenuItem value='1.60 GB'>1.6 GB</MenuItem>
              <MenuItem value='1.80 GB'>1.8 GB</MenuItem>
              <MenuItem value='2.00 GB'>2 GB</MenuItem>
            </Select>
          </FormControl>
        </Tooltip>
      </StyledTableCell>
      <StyledTableCell align='left'>
        <Box>
          <CustomizedSwitches
            checked={
              itemsState.find((item) => item.id === data.id)?.active ??
              data.active
            }
            onChange={() => handleSwitchChange(data)}
            disabled={
              data.active &&
              sessionStorage.getItem('licenceTierTeamsync') == 'TRIAL'
            }
          />
        </Box>
        {/* {itemsState.find((item) => item.id === data.id)?.active
          ? 'Active'
          : 'Inactive'} */}
      </StyledTableCell>
      <TableCell align='right'>
        <OrderActions id={data.id} />
      </TableCell>
    </TableRow>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object),
  onItemsStateUpdate: PropTypes.any,
  setTableData: PropTypes.any,
  license: PropTypes.any,
  handletiername: PropTypes.any,
  setList: PropTypes.any,
  setSelectedUsers: PropTypes.any,
  selectedUsers: PropTypes.any,
};
