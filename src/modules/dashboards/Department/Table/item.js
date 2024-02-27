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
}) => {
  // const [itemsState, setItemsState] = useState([]);

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
    // if (itemsState.length <= 0) {
    //   onButtonDisable(true);
    // } else {
    //   onButtonDisable(false);
    // }
    console.log(itemsState, productData, 'productData');
    const isAnyItemInactive = itemsState.some(
      (item) =>
        item.active_status !==
        productData.find((d) => d.id === item.id).active_status,
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
          {ellipsisLines(data.deptName)}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data.deptDisplayName}</StyledTableCell>
      <StyledTableCell align='left'>{data.branch}</StyledTableCell>
      <StyledTableCell align='left'>{data.cau}</StyledTableCell>
      <TableCell align='right'>
        {/* <EditIcon />
        <VisibilityIcon />
        <RiSplitCellsHorizontal /> */}
        <OrderActions
          id={data.id}
          displayname={data.deptDisplayName}
          deptName={data.deptName}
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
