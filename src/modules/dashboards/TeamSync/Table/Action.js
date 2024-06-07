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

const OrderActions = ({id, setTotal, setList, list, displayname, deptName}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${window.__ENV__.REACT_APP_MIDDLEWARE}/kms/courses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        },
      );
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

  return (
    <Box>
      <IconButton
        aria-controls='alpha-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      {/* <Menu
        id='alpha-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          style={{fontSize: 14}}
          onClick={() =>
            navigate(`/edit-department/${id}`, {state: {deptName}})
          }
        >
          Edit Department
        </MenuItem>
        <MenuItem
          style={{fontSize: 14}}
          onClick={() => handlestate(id, displayname, deptName)}
        >
          Add and View Roles
        </MenuItem>
        <MenuItem
          style={{fontSize: 14}}
         
          onClick={handleClose}
        >
          Spilt Department
        </MenuItem>
       
      </Menu> */}
    </Box>
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
};
