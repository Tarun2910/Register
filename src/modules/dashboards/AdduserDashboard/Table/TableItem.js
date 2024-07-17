import React, {useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {ellipsisLines} from '@crema/helpers/StringHelper';
import CustomizedSwitches from './switchButton';
import OrderActions from './Actions';

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
  useEffect(() => {
    const initialItemsState = productData.map((data) => ({
      id: data.id,
      active: data.active,
    }));
    setTableData(initialItemsState);
  }, [productData, setTableData]);

  useEffect(() => {
    onItemsStateUpdate(itemsState);
    const isAnyItemInactive = itemsState.some(
      (item) =>
        item.active !== productData.find((d) => d.id === item.id).active,
    );
    onButtonDisable(!isAnyItemInactive);
  }, [itemsState, onItemsStateUpdate, onButtonDisable, productData]);

  const handleSwitchChange = (data) => {
    const id = data.id;
    setItemsState((prevItemsState) => {
      const updatedItemsState = prevItemsState.map((item) =>
        item.id === id ? {...item, active: !item.active} : item,
      );
      return updatedItemsState.length
        ? updatedItemsState
        : [...prevItemsState, {id, active: !data.active}];
    });
  };

  const adminName = sessionStorage.getItem('AdminName');

  return productData.map((data) => (
    <TableRow key={data.id} className='item-hover'>
      <StyledTableCell align='left'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ( data.name === adminName ? `${data.name} (Admin)` : {data.name}, )
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data.email}</StyledTableCell>
      <StyledTableCell align='center'>
        <CustomizedSwitches
          checked={
            itemsState.find((item) => item.id === data.id)?.active ??
            data.active
          }
          onChange={() => handleSwitchChange(data)}
          disabled={
            data.active &&
            sessionStorage.getItem('licenceTierTeamsync') === 'TRIAL'
          }
        />
      </StyledTableCell>
      <StyledTableCell align='right'>
        <OrderActions id={data.id} />
      </StyledTableCell>
    </TableRow>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemsStateUpdate: PropTypes.func.isRequired,
  onButtonDisable: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
  itemsState: PropTypes.arrayOf(PropTypes.object).isRequired,
  setItemsState: PropTypes.func.isRequired,
};
