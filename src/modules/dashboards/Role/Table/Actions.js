import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import {toast} from 'react-toastify';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Fonts} from '@crema/constants/AppEnums';

const OrderActions = ({
  id,
  setTotal,
  setList,
  list,
  displayname,
  deptName,
  setTriggerApi,
  data,
  updateRole,
  setRoleName,
  setRoleDisplayName,
  setRowData,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [opendialog, setOpenDialog] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [selecteduser, setselectedUser] = React.useState(null);
  const [roleNameone, setRoleNameone] = React.useState(null);
  const [Isuserassigned, setIsuserAssigned] = React.useState(null);
  const open = Boolean(anchorEl);

  console.log(data, 'data');
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/kms/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedList = list.filter((course) => course.id !== id);
      setList(updatedList);
      const courseLength = response.headers['totalcourses'];
      setTotal(courseLength);
      handleClose();
      toast.success('Course Deleted successfully!');
    } catch (err) {
      console.log(err);
    }
  };

  const handlestate = (id, displayname) => {
    // Navigate to the specific id route and pass data through state
    navigate(`/roles/${id}`, {state: {displayname, deptName}});
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setRoleNameone(data?.roleName);
    setIsuserAssigned(data?.userDetails?.deptUsername);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users?pageNum=${0}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/departments/${deptName}/roles`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: [
        {
          id: id,
          user: {email: selecteduser.email},
        },
      ],
    };

    axios
      .request(config)
      .then((response) => {
        handleCloseDialog();
        setTriggerApi((prevState) => !prevState);
        handleClose();
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
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/multitenant/adminportal/api/switchRole`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        roleName: roleNameone,
        currentUserName: Isuserassigned,
        newUserName: selecteduser?.deptUsername,
      },
    };

    axios
      .request(config)
      .then((response) => {
        handleCloseDialog();
        setTriggerApi((prevState) => !prevState);
        handleClose();
      })
      .catch((error) => {
        toast.error(error.message);
        handleCloseDialog();
      });
  };

  return (
    <>
      <Box>
        <IconButton
          aria-controls='alpha-menu'
          aria-haspopup='true'
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id='alpha-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem
            style={{fontSize: 14}}
            onClick={() => {
              updateRole();
              setRoleName(data?.roleName);
              setRoleDisplayName(data?.roleDisplayName);
              setRowData(data);
            }}
          >
            Edit Role
          </MenuItem>
          <MenuItem
            style={{fontSize: 14}}
            onClick={() => {
              handleOpenDialog();
            }}
          >
            {Isuserassigned ? 'Switch User' : 'Assign User'}
          </MenuItem>
        </Menu>
      </Box>
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
        open={opendialog}
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
            getOptionLabel={(option) => option?.name}
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
  );
};
export default OrderActions;

OrderActions.propTypes = {
  id: PropTypes.string,
  setTotal: PropTypes.any,
  setList: PropTypes.any,
  list: PropTypes.any,
  displayname: PropTypes.any,
  deptName: PropTypes.any,
  setTriggerApi: PropTypes.any,
  data: PropTypes.any,
  updateRole: PropTypes.any,
  setRoleName: PropTypes.any,
  setRowData: PropTypes.any,
  setRoleDisplayName: PropTypes.any,
};
