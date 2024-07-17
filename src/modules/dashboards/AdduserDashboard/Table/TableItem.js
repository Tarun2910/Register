import React, {useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {ellipsisLines} from '@crema/helpers/StringHelper';
import CustomizedSwitches from './switchButton';
import OrderActions from './Actions';
import {Checkbox} from '@mui/material';

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

  return productData.map((data) => (
    <TableRow key={data.id} className='item-hover'>
      <StyledTableCell>
        <Checkbox size='small' sx={{padding: '0px', fontSize: '0.77rem'}} />
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
      <StyledTableCell align='left'>{data.email}</StyledTableCell>
      <StyledTableCell align='center'>
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
      </StyledTableCell>
      <TableCell align='right'>
        <OrderActions
          id={data.id}
          // setTotal={setTotal}
          // setPage={setPage}
          // setList={setList}
          // list={list}
        />
      </TableCell>
    </TableRow>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object),
  onItemsStateUpdate: PropTypes.any,
  setTableData: PropTypes.any,
};
