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
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: 14,
  padding: 8,
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
}) => {
  // const [itemsState, setItemsState] = useState([]);

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
        totalBytes = 1073741824;
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

  return productData.map((data) => (
    <TableRow key={data.id} className='item-hover' sx={{height: '2rem'}}>
      <StyledTableCell align='left' sx={{width: 400}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'primary.main',
          }}
        >
          {ellipsisLines(data.userId)}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data.deptDisplayUsername}</StyledTableCell>
      <StyledTableCell align='left'>
        {' '}
        <FormControl variant='outlined' style={{minWidth: 120}} size='small'>
          <InputLabel>STORAGE</InputLabel>
          <Select
            label='STORAGE'
            value={data?.allowedStorageInBytesDisplay}
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
            <MenuItem value='25 MB'>25 MB</MenuItem>
            <MenuItem value='50 MB'>50 MB</MenuItem>
            <MenuItem value='100 MB'>100 MB</MenuItem>
            <MenuItem value='200 MB'>200 MB</MenuItem>
            <MenuItem value='500 MB'>500 MB</MenuItem>
            <MenuItem value='1 GB'>1 GB</MenuItem>
          </Select>
        </FormControl>
      </StyledTableCell>
      <StyledTableCell align='left'>{data.displayStorage}</StyledTableCell>
      <StyledTableCell align='left'>
        <OrderActions
          id={data.id}
          // setTotal={setTotal}
          // setPage={setPage}
          // setList={setList}
          // list={list}
        />
      </StyledTableCell>
    </TableRow>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object),
  onItemsStateUpdate: PropTypes.any,
  setTableData: PropTypes.any,
  setList: PropTypes.any,
};
