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
  showUsers,
}) => {
  // const [itemsState, setItemsState] = useState([]);
  const ActiveIcon = styled(CheckCircleIcon)(({theme, active}) => ({
    color: active ? theme.palette.success.main : theme.palette.action.disabled,
  }));

  const InactiveIcon = styled(CancelIcon)(({theme, active}) => ({
    color: active ? theme.palette.error.main : theme.palette.action.disabled,
  }));

  const PendingIcon = styled(HourglassEmptyIcon)(({theme, active}) => ({
    color: active ? 'rgb(255, 215, 0)' : theme.palette.action.disabled,
  }));

  console.log(productData, 'productData321');

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

  // const handleSwitchChange = (data) => {
  //   const id = data.id;
  //   const itemIndex = itemsState.findIndex((item) => item.id === id);

  //   setItemsState((prevItemsState) => {
  //     const updatedItemsState = [...prevItemsState];

  //     if (itemIndex !== -1) {
  //       // If the item is already in the state, update only the specific item
  //       updatedItemsState[itemIndex].active =
  //         !updatedItemsState[itemIndex].active;
  //     } else {
  //       // If the item is not in the state, add it to the state
  //       updatedItemsState.push({id, active: !data.active});
  //     }

  //     return updatedItemsState;
  //   });
  // };
  const iconStyle = {margin: '0 8px'}; // Adjust margin as needed

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
      <StyledTableCell align='left' sx={{width: 400}}>
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
      {/* <StyledTableCell align='left'>
        {' '}
        <Tooltip
          title={
            disable == 'TRIAL' && `In free Tier You Can't Change the Storage`
          }
        >
          <FormControl variant='outlined' style={{minWidth: 120}} size='small'>
            <InputLabel>STORAGE</InputLabel>
            <Select
              label='STORAGE'
              value={data?.allowedStorageInBytesDisplay}
              disabled={disable == 'TRIAL'}
              onChange={(event) =>
                handleChange(
                  data.id,
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
      </StyledTableCell> */}
      <StyledTableCell align='left'>{data.displayStorage}</StyledTableCell>
      {showUsers ? (
        <StyledTableCell align='center'>
          <ActiveIcon active={data.status === 'active'} sx={iconStyle} />
          <PendingIcon active={data.status === 'pending'} sx={iconStyle} />
          <InactiveIcon active={data.status === 'inactive'} sx={iconStyle} />
        </StyledTableCell>
      ) : (
        <StyledTableCell align='left'>
          <OrderActions
            id={data.id}
            // setTotal={setTotal}
            // setPage={setPage}
            // setList={setList}
            // list={list}
          />
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
