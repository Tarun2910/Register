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

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:hover': {
    background: '#e0ecf0',
    borderRadius: '15px',
    color: '#354c64 !important', // Add your desired hover color here
  },
}));

const TableItem = ({
  productData,
  onItemsStateUpdate,
  onButtonDisable,
  setTableData,
  itemsState,
  setItemsState,
  updateDepartment,
  setSelectedDeptId,
  setdeptName,
  setdeptDisplayName,
  setbranchCity,
  setRowData,
  selectedList,
  setSelectedList,
  setList,
}) => {
  let disable = sessionStorage.getItem('licenceTierTeamsync');

  // const [itemsState, setItemsState] = useState([]);

  // useEffect(() => {
  //   // Initialize itemsState with default values from productData
  //   const initialItemsState = productData.map((data) => ({
  //     id: data.id,
  //     active: data.active,
  //   }));
  //   setTableData(initialItemsState);
  // }, [itemsState]);

  const handleCheckboxSelection = (e) => {
    console.log(e);
  };

  const handleChange = (data, allowedStorageInBytesDisplay) => {
    console.log(allowedStorageInBytesDisplay, 'kk');
    let newArr = [];
    productData.map((item) => {
      if (item.id == data.id) {
        const permissions = {
          ...item.permissions,
          allowedStorageInBytesDisplay: allowedStorageInBytesDisplay,
        };
        newArr.push({...item, permissions});
      } else newArr.push(item);
    });
    setList(newArr);
    let totalBytes = allowedStorageInBytesDisplay.split(' ')[0];
    if (allowedStorageInBytesDisplay.split(' ')[1] == 'GB') {
      totalBytes = totalBytes * 1024 ** 3;
    } else {
      totalBytes = totalBytes * 1024 ** 2;
    }
    setItemsState((prev) => [
      ...prev,
      {
        active: true,
        permissions: {
          ...data.permissions,
          allowedStorageInBytesDisplay,
          allowedStorageInBytes: totalBytes,
        },
      },
    ]);
  };

  const handleRowDoubleClick = (data) => {
    updateDepartment();
    setSelectedDeptId(data);
    setbranchCity(data.branchCity);
    setdeptName(data.deptName);
    setdeptDisplayName(data.deptDisplayName);
    setRowData(data);
  };

  return productData.map((data) => (
    <StyledTableRow
      key={data.id}
      className='item-hover'
      onDoubleClick={() => handleRowDoubleClick(data)}
    >
      <StyledTableCell align='left'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            size='small'
            onChange={() => handleCheckboxSelection(data)}
          />
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {data.deptDisplayName}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data.deptName}</StyledTableCell>
      <StyledTableCell align='left'>{data.branchCity}</StyledTableCell>
      <StyledTableCell align='center'>
        {' '}
        <Tooltip
          title={
            disable == 'TRIAL'
              ? `In free Tier You Can't Change the Storage`
              : !data?.permissions?.id
              ? 'The user must log in to drive first.'
              : ''
          }
        >
          <FormControl variant='outlined' style={{minWidth: 120}} size='small'>
            <InputLabel>STORAGE</InputLabel>
            <Select
              label='STORAGE'
              value={data?.permissions?.allowedStorageInBytesDisplay}
              sx={{height: '1.8rem'}}
              disabled={!data?.permissions?.id || disable == 'TRIAL'}
              onChange={(event) => handleChange(data, event.target.value)}
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
      {/* <TableCell align='right'>
        <OrderActions
          id={data.id}
          data={data}
          displayname={data.deptDisplayName}
          deptName={data.deptName}
          updateDepartment={updateDepartment}
          setSelectedDeptId={setSelectedDeptId}
          setdeptName={setdeptName}
          setdeptDisplayName={setdeptDisplayName}
          setbranchCity={setbranchCity}
          setRowData={setRowData}
        />
      </TableCell> */}
    </StyledTableRow>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object),
  onItemsStateUpdate: PropTypes.any,
  setTableData: PropTypes.any,
  updateDepartment: PropTypes.any,
  setSelectedDeptId: PropTypes.any,
  setdeptName: PropTypes.any,
  setdeptDisplayName: PropTypes.any,
  setbranchCity: PropTypes.any,
  setRowData: PropTypes.any,
  selectedList: PropTypes.any,
  setSelectedList: PropTypes.any,
};
