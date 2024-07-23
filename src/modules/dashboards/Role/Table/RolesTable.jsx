import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './header';
import TableItem from './item';
import AppTableContainer from '@crema/components/AppTableContainer';
import AppLoader from '@crema/components/AppLoader';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  styled,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import TableHeader from '@crema/components/AppTable/TableHeader';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import {toast} from 'react-toastify';
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

const RolesTable = ({
  tableData,
  setOpenRoles,
  setRolesList,
  setTriggerApi,
  rowData,
}) => {
  console.log(rowData);

  const handleRemoveUser = (event) => {
    let newArr = [];
    try {
      tableData.map((item) => {
        if (item.id != event.id) {
          newArr.push(item.email);
        }
      });
      setRolesList(newArr);
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/departments/${rowData.department.deptName}/roles`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          roleName: rowData.roleName,
        },
        data: newArr,
      };

      axios.request(config).then(() => {
        setTriggerApi((prevState) => !prevState);
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setOpenRoles(false);
    }
  };

  return (
    <AppTableContainer>
      <Table stickyHeader className='table'>
        <TableHead>
          <TableHeader>
            <TableCell align='left'>Name</TableCell>
            <TableCell align='center'>Email Id</TableCell>
            <TableCell align='center'> </TableCell>
          </TableHeader>
        </TableHead>
        <TableBody>
          {tableData?.map((data) => (
            <TableRow
              key={data.id}
              className='item-hover'
              // onDoubleClick={() => handleRowDoubleClick(data)}
            >
              {/* <StyledTableCell align='left'>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'primary.main',
                  }}
                >
                  <Checkbox size='small' />
            
                  </Box>
              </StyledTableCell> */}
              <StyledTableCell align='left'>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {data?.name}
                </Box>
              </StyledTableCell>
              <StyledTableCell align='left'>{data.email}</StyledTableCell>
              <StyledTableCell align='center'>
                <Tooltip title='REMOVE'>
                  <IconButton
                    size='small'
                    onClick={() => handleRemoveUser(data)}
                  >
                    <RemoveCircleIcon size='small' />
                  </IconButton>
                </Tooltip>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppTableContainer>
  );
};

export default RolesTable;

RolesTable.defaultProps = {
  tableData: [],
};

RolesTable.propTypes = {
  rowData: PropTypes.any,
  tableData: PropTypes.any,
  setOpenRoles: PropTypes.any,
  setRolesList: PropTypes.any,
  setRowData: PropTypes.any,
  setTriggerApi: PropTypes.any,
};
