import React, {useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {ellipsisLines} from '@crema/helpers/StringHelper';
import OrderActions from './Actions';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {RiSplitCellsHorizontal} from 'react-icons/ri';
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
  setTriggerApi,
  updateRole,
  setRoleName,
  setRoleDisplayName,
  setRowData,
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

  const handleCheckboxChange = (e) => {
    console.log(e);
  };

  console.log(itemsState, 'itemsState');

  return productData.map((data) => (
    <TableRow key={data.id} className='item-hover'>
      <StyledTableCell align='left'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'primary.main',
          }}
        >
          <Checkbox size='small' onChange={handleCheckboxChange} />
        </Box>
      </StyledTableCell>
      <StyledTableCell align='center'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox size='small' onChange={handleCheckboxChange} />
        </Box>
      </StyledTableCell>
      <StyledTableCell align='center'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {data.roleName}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='center'>{data.roleDisplayName}</StyledTableCell>
      {/* <StyledTableCell align='center'>{data.displayRoleName}</StyledTableCell> */}
      <StyledTableCell align='center'>
        {data?.user?.name || 'User not Assigned Yet'}
      </StyledTableCell>
      <TableCell align='right'>
        {/* <EditIcon />
        <VisibilityIcon />
        <RiSplitCellsHorizontal /> */}
        <OrderActions
          id={data.id}
          data={data}
          displayname={data.deptDisplayName}
          deptName={data.deptName}
          setTriggerApi={setTriggerApi}
          updateRole={updateRole}
          setRoleName={setRoleName}
          setRoleDisplayName={setRoleDisplayName}
          setRowData={setRowData}
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
  setTriggerApi: PropTypes.any,
  setRoleName: PropTypes.any,
  setRoleDisplayName: PropTypes.any,
  updateRole: PropTypes.any,
  setRowData: PropTypes.any,
};
