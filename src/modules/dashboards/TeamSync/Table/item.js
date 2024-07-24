import React, {useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {ellipsisLines} from '@crema/helpers/StringHelper';
import OrderActions from './Action';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {RiSplitCellsHorizontal} from 'react-icons/ri';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import CustomizedSwitches from 'modules/dashboards/AdduserDashboard/Table/switchButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineClockCircle,
} from 'react-icons/ai';

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

const iconSize = 20;

const ActiveIcon = styled(AiOutlineCheckCircle)(({active}) => ({
  color: active ? 'green' : 'gray',
  fontSize: iconSize,
}));

const InactiveIcon = styled(AiOutlineCloseCircle)(({active}) => ({
  color: active ? 'red' : 'gray',
  fontSize: iconSize,
}));

const PendingIcon = styled(AiOutlineClockCircle)(({active}) => ({
  color: active ? '#FFA500' : 'gray',
  fontSize: iconSize,
}));

const iconStyle = {margin: '0 8px'};

const StatusIcon = ({status}) => {
  if (status === 'active') {
    return <ActiveIcon sx={iconStyle} active={true} />;
  } else if (status === 'inactive') {
    return <InactiveIcon sx={iconStyle} active={true} />;
  } else if (status === 'pending') {
    return <PendingIcon sx={iconStyle} active={true} />;
  } else {
    return null; // In case of an unknown status
  }
};

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
};

const TableItem = ({
  productData,
  onItemsStateUpdate,
  onButtonDisable,
  setTableData,
  itemsState,
  setItemsState,
  setList,
  showUsers,
}) => {
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

  const handleChange = (userId, field, newValue) => {
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

  return productData.map((data) => (
    <TableRow key={data.id} className='item-hover' sx={{height: '2rem'}}>
      <StyledTableCell align='left' sx={{width: 330}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {data.userId}
        </Box>
      </StyledTableCell>
      {/* <StyledTableCell align='left'>{data.deptDisplayUsername}</StyledTableCell> */}

      <StyledTableCell align='left'>{data.displayStorage}</StyledTableCell>
      <StyledTableCell align='left'>
        {data.allowedStorageInBytesDisplay}
      </StyledTableCell>
      {showUsers && (
        <StyledTableCell align='center'>
          {/* <ActiveIcon active={data.status === 'active'} sx={iconStyle} />
          <PendingIcon active={data.status === 'pending'} sx={iconStyle} />
          <InactiveIcon active={data.status === 'inactive'} sx={iconStyle} /> */}
          <StatusIcon status={data.status} />
        </StyledTableCell>
      )}
    </TableRow>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object),
  onItemsStateUpdate: PropTypes.any,
  setTableData: PropTypes.any,
  setList: PropTypes.any,
  showUsers: PropTypes.any,
};
