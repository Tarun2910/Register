import React, {useState, useEffect} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {ellipsisLines} from '@crema/helpers/StringHelper';
import OrderActions from './Action';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {Autocomplete, TextField, Tooltip} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import {Button, Dialog, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Fonts} from '@crema/constants/AppEnums';
import IconButton from '@mui/material/IconButton';
import IntlMessages from '@crema/helpers/IntlMessages';
import {toast} from 'react-toastify';
import axios from 'axios';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

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
  handleDeleteSubordinate,
  setTriggerApi,
  deptName,
}) => {
  // const [itemsState, setItemsState] = useState([]);
  const [opendialogassign, setOpenDialogAssign] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [selecteduser, setselectedUser] = React.useState(null);
  const [roleName, setRoleName] = React.useState(null);
  const [Isuserassigned, setIsuserAssigned] = React.useState(null);
  const [roleid, setRoleId] = React.useState('');

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

  const handleCloseDialog = () => {
    setOpenDialogAssign(false);
  };

  const handleOpenDialog = (data) => {
    setOpenDialogAssign(true);
    setRoleName(data?.roleName);
    setIsuserAssigned(data?.user?.name);
    setRoleId(data?.id);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users?pageNum=${0}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        appName: 'TeamSync',
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response, 'response');
        setUser(response?.data?.content);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleAssignUser = () => {
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `/tenants/departments/${deptName}/roles`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
      data: [
        {
          id: roleid,
          user: {email: selecteduser.email},
        },
      ],
    };

    axios
      .request(config)
      .then((response) => {
        handleCloseDialog();
        setTriggerApi((prevState) => !prevState);
      })
      .catch((error) => {
        toast.error(error.message);
        handleCloseDialog();
      });
  };

  const handleSwitchUser = () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `/multitenant/adminportal/api/switchRole`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        roleName: roleName,
        currentUserName: Isuserassigned,
        newUserName: selecteduser?.deptUsername,
      },
    };

    axios
      .request(config)
      .then((response) => {
        handleCloseDialog();
        setTriggerApi((prevState) => !prevState);
      })
      .catch((error) => {
        toast.error(error.message);
        handleCloseDialog();
      });
  };

  return productData.map((data) => (
    <>
      <TableRow key={data.id} className='item-hover' style={{height: '4rem'}}>
        {/* <StyledTableCell align='left' sx={{width: 400}}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'primary.main',
            }}
          >
            {ellipsisLines(data.displayRoleName)}
          </Box>
        </StyledTableCell> */}
        <StyledTableCell align='left'>{data.roleName}</StyledTableCell>
        <StyledTableCell align='left'>
          {data?.user?.name || 'User not Assigned Yet'}
        </StyledTableCell>

        <StyledTableCell align='left' onClick={() => handleOpenDialog(data)}>
          <Tooltip title={data?.user?.name ? 'Switch User' : 'Assign User'}>
            {data?.user?.name ? (
              <FlipCameraAndroidIcon style={{cursor: 'pointer'}} />
            ) : (
              <PersonAddOutlinedIcon style={{cursor: 'pointer'}} />
            )}
          </Tooltip>
        </StyledTableCell>
      </TableRow>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
          },
          '& .MuiDialogContent-root': {
            overflowY: 'hidden',
            // paddingLeft: 0,
            // paddingRight: 0,
          },
        }}
        open={opendialogassign}
      >
        <DialogTitle
          sx={{
            fontSize: 14,
            fontWeight: Fonts.MEDIUM,
          }}
          id='app-dialog-title'
        >
          {Isuserassigned ? 'Switch User' : 'Assign User'}

          <IconButton
            aria-label='close'
            sx={{
              position: 'absolute',
              right: 4,
              top: 4,
              color: 'grey.500',
            }}
            onClick={handleCloseDialog}
            size='large'
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* <AppScrollbar
        sx={{
          paddingTop: 1,
          height: fullHeight ? '70vh' : '100%',
          minHeight: '300px',
          maxHeight: maxScrollHeight ? maxScrollHeight : '400px',
          paddingRight: 6,
          paddingLeft: 6,
        }}
      >
        {children}
      </AppScrollbar> */}
          <Autocomplete
            id='tags-outlined'
            options={user}
            getOptionLabel={(option) => option.name}
            value={selecteduser}
            onChange={(event, value) => setselectedUser(value)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Select User'
                fullWidth
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button
            color='primary'
            variant='contained'
            onClick={handleAssignUser}
            disabled={selecteduser === null}
          >
            {'SAVE'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ));
};

export default TableItem;

TableItem.propTypes = {
  productData: PropTypes.arrayOf(PropTypes.object),
  onItemsStateUpdate: PropTypes.any,
  setTableData: PropTypes.any,
  handleDeleteSubordinate: PropTypes.any,
  setTriggerApi: PropTypes.any,
  deptName: PropTypes.any,
};
