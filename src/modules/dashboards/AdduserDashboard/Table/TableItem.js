import React, {useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {ellipsisLines} from '@crema/helpers/StringHelper';
import CustomizedSwitches from './switchButton';

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
}) => {
  const [itemsState, setItemsState] = useState([]);

  useEffect(() => {
    // Initialize itemsState with default values from productData
    const initialItemsState = productData.map((data) => ({
      id: data.id,
      active_status: data.active_status,
    }));
    setTableData(initialItemsState);
  }, [itemsState]);

  useEffect(() => {
    // Call the callback function to send the updated state to the parent
    onItemsStateUpdate(itemsState);
    if (itemsState.length <= 0) {
      onButtonDisable(true);
    } else {
      onButtonDisable(false);
    }
  }, [itemsState, onItemsStateUpdate]);

  const handleSwitchChange = (data) => {
    const id = data.id;
    const itemIndex = itemsState.findIndex((item) => item.id === id);

    setItemsState((prevItemsState) => {
      const updatedItemsState = [...prevItemsState];

      if (itemIndex !== -1) {
        // If the item is already in the state, update only the specific item
        updatedItemsState[itemIndex].active_status =
          !updatedItemsState[itemIndex].active_status;
      } else {
        // If the item is not in the state, add it to the state
        updatedItemsState.push({id, active_status: !data.active_status});
      }

      return updatedItemsState;
    });
  };

  console.log(itemsState, 'itemsState');

  return productData.map((data) => (
    <TableRow key={data.id} className='item-hover'>
      <StyledTableCell align='left' sx={{width: 400}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'primary.main',
          }}
        >
          {ellipsisLines(data.name)}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data.email}</StyledTableCell>
      <StyledTableCell align='left'>{data.active_status}</StyledTableCell>
      <StyledTableCell align='center'>
        <Box>
          <CustomizedSwitches
            checked={
              itemsState.find((item) => item.id === data.id)?.active_status ??
              data.active_status
            }
            onChange={() => handleSwitchChange(data)}
          />
        </Box>
      </StyledTableCell>
    </TableRow>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object),
  onItemsStateUpdate: PropTypes.any,
  setTableData: PropTypes.any,
};
