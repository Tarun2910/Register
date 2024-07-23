import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import {
  DialogActions,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Hidden,
  Tooltip,
  Paper,
  TextField,
  InputAdornment,
  Autocomplete,
  Divider,
  IconButton,
  Fab,
  Chip,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsPagination from '@crema/components/AppsPagination';
import AppSearchBar from '@crema/components/AppSearchBar';
import AppGridContainer from '@crema/components/AppGridContainer';
import {Fonts} from '@crema/constants/AppEnums';
import AppCard from '@crema/components/AppCard';
import Slide from '@mui/material/Slide';
import ListingTable from './Table';
import axios from 'axios';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import {blue, orange} from '@mui/material/colors';
import {useNavigate} from 'react-router-dom';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';
import CloseIcon from '@mui/icons-material/Close';
import Draggables from 'react-draggable';
import {Cancel} from '@mui/icons-material';
import Draggable from 'react-draggable';
import {makeStyles} from '@mui/styles';
import {debounce} from 'lodash';
import {toast} from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {getRolesData} from 'redux/features/rolesDataSlice';
import {Add} from '@mui/icons-material';
import RolesTable from './Table/RolesTable';
import AddUserAction from './Table/Actions';

const useStyles = makeStyles((theme) => ({
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '1rem',
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    padding: '5px',
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggables
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggables>
  );
};

const ProductListing = () => {
  const dispatch = useDispatch();

  const {rolesData, rolesDataIsSuccess, rolesDataIsLoading} = useSelector(
    (state) => state.roles,
  );

  const {messages} = useIntl();
  const Navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [list, setList] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [total, setTotal] = useState(0);

  const [updatedItemsState, setUpdatedItemsState] = useState([]);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [itemsState, setItemsState] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [triggerApi, setTriggerApi] = useState(false);
  const [department, setDepartment] = useState([]);
  const [opendialogdept, setOpenDialogDept] = useState(false);
  const [openrole, setOpenRole] = useState(false);
  const [deptdata, setDeptData] = useState([]);
  const [selecteddept, setselectedDept] = useState(null);
  const [roles, setRoles] = useState('');
  const [user, setUser] = useState('');
  const [searchData, setSearchData] = useState('');
  const [isedit, setIsEdit] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDisplayname, setRoleDisplayName] = useState('');
  const [rowdata, setRowData] = useState('');
  const [rolesList, setRolesList] = useState([]);
  const [openRoles, setOpenRoles] = useState(false);

  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };
  let Departmentcounts = sessionStorage.getItem('DepartmentCount');

  let userData = [
    {
      roleName: `${selecteddept?.deptName} ${roles}`,
      displayRoleName: user,
      deptName: selecteddept?.deptName,
    },
  ];

  useEffect(() => {
    if (Departmentcounts == 0) {
      setOpenDialogDept(true);
    }
  }, []);

  const handleCloseDialog = () => {
    setOpenDialogDept(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigateToDept = () => {
    Navigate('/department');
  };

  const activeUsersCount = updatedItemsState.filter(
    (item) => item.active === true,
  ).length;

  const onPageChange = (event, value) => {
    setPage(value);
    console.log(value, 'value');
  };

  useEffect(() => {
    if (rolesDataIsSuccess) {
      setList(rolesData?.content);
      setTotal(rolesData?.totalElements);
      sessionStorage.setItem('RoleCount', rolesData?.totalElements);
    }
  }, [rolesDataIsSuccess]);

  // useEffect(() => {
  // let config = {
  //   method: 'get',
  //   maxBodyLength: Infinity,
  //   url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/roles?search=${searchData}`,
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json; charset=utf8',
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     pageSize: '10',
  //     pageNumber: page,
  //     userName: sessionStorage.getItem('username'),
  //     deptName: 'ALL_USER',
  //   },
  // };
  // setLoading(true);
  // axios
  //   .request(config)
  //   .then((response) => {
  //     setLoading(false);
  //     console.log(response.data);
  //     setList(response?.data?.content);
  //     setTotal(response?.data?.totalElements);
  //     sessionStorage.setItem('RoleCount', response?.data?.totalElements);
  //   })
  //   .catch((error) => {
  //     setLoading(false);
  //     console.log(error);
  //   });
  // }, [page, triggerApi, searchData]);

  useEffect(() => {
    dispatch(getRolesData({pageSize: 10, pageNumber: page, searchText: ''}));
  }, [page, triggerApi]);

  useEffect(() => {
    setLoading(rolesDataIsLoading);
  }, [rolesDataIsLoading]);

  // const searchProduct = (title) => {
  //   setFilterData({...filterData, title});
  // };

  const HandleNavigate = () => {
    Navigate('/add-department');
  };

  // const handlesaveChanges = () => {
  //   // Check if remaining license is less than the count of active users
  //   const activeUsersCount = updatedItemsState.filter(
  //     (item) => item.active === true,
  //   ).length;

  //   const inactiveUsersCount = updatedItemsState.filter(
  //     (item) => item.active === false,
  //   ).length;

  //   const TotalLength = activeUsersCount - inactiveUsersCount;

  //   console.log(TotalLength, license, 'activeuserCount');

  //   if (license < TotalLength) {
  //     handleClickOpen();
  //   }
  //   let config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: '/tenants/users/status',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //     data: updatedItemsState,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       // const RemainingUsers = response.headers['usersRemaining'];
  //       setLicense(response?.data?.usersRemaining);
  //       setList(response?.data?.allUsers?.content);
  //       setTotal(response?.data?.allUsers?.totalElements);
  //       setItemsState([]);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const navigatetoUpgrade = () => {
    Navigate('/upgrade');
  };

  const debouncedSearch = debounce((searchQuery) => {
    setSearchData(searchQuery);
    setPage(0); // Reset page when performing a new search
  }, 500);

  // const searchData = (searchQuery) => {
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: `/tenants/users?keyword=${searchQuery}&pageNum=${'0'}`,
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       setList(response?.data?.content);
  //       setTotal(response?.data?.totalElements);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const handlegotoupgrade = () => {
  //   Navigate('/upgrade');
  // };

  // const handletiername = () => {
  //   if (licensetier === 'growth') {
  //     return 20;
  //   } else if (licensetier === 'pro') {
  //     return 30;
  //   } else {
  //     return 5;
  //   }
  // };

  // const handleAddDomain = () => {
  //   console.log('clicked');
  // };

  // const handleopenDomain = () => {
  //   setOpenDomain(true);
  // };

  // const handlecloseDomain = () => {
  //   setOpenDomain(false);
  // };

  const handleAddRole = () => {
    setOpenRole(true);
    setIsEdit(false);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${
        window.__ENV__.REACT_APP_MIDDLEWARE
      }/tenants/departments?search=${''}`,

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf8',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        pageSize: '10',
        pageNumber: page,
        userName: sessionStorage.getItem('username'),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setLoading(false);
        setDeptData(response?.data?.content);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleCloseRole = () => {
    setOpenRole(false);
  };

  const handlesaveRole = () => {
    setOpenRole(false);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/departments/${selecteddept.deptName}/roles`,
      headers: {
        userId: selecteddept.id,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: [{roleName: roleName, roleDisplayName: roleDisplayname}],
    };

    axios
      .request(config)
      .then((response) => {
        toast.success('Roles Added successfully!');
        setTriggerApi((prevState) => !prevState);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const updateRole = () => {
    setIsEdit(true);
    setOpenRole(true);
  };
  const handleupdate = () => {
    const config = {
      method: 'put',
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/roles`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        departmentName: rowdata?.department?.deptName,
      },
      data: {
        roleName: roleName,
        roleDisplayName: `${
          rowdata?.roleName?.split('.')[0]
        }.${roleDisplayname}`,
        tenantId: rowdata?.tenantId,
        id: rowdata?.id,
        deptName: rowdata?.department?.deptName,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setLoading(false);
        setTriggerApi((prev) => !prev);
        handleCloseRole();
        toast.success('Role Updated successfully!');
      })
      .catch((error) => {
        setLoading(false);
        handleCloseRole();
        toast.error(error?.response?.data?.error || 'Failed to update Role');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isedit ? handleupdate() : handlesaveRole();
  };

  return (
    <>
      <AppGridContainer spacing={7}>
        <Slide direction='right' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={12}>
            <AppCard headerStyle={{p: 0}} contentStyle={{p: 0}}>
              <AppsContent
                sx={{
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <ListingTable
                  productData={list || []}
                  thumbnailUrls={thumbnailUrls}
                  loading={loading}
                  setTotal={setTotal}
                  setPage={setPage}
                  setList={setList}
                  list={list}
                  onItemsStateUpdate={setUpdatedItemsState}
                  onButtonDisable={setDisable}
                  setTableData={setTableData}
                  setItemsState={setItemsState}
                  itemsState={itemsState}
                  setSelectedIds={setSelectedIds}
                  selectedIds={selectedIds}
                  isAllSelected={isAllSelected}
                  setIsAllSelected={setIsAllSelected}
                  setTriggerApi={setTriggerApi}
                  setIsEdit={setIsEdit}
                  updateRole={updateRole}
                  setRoleName={setRoleName}
                  setRoleDisplayName={setRoleDisplayName}
                  setRowData={setRowData}
                  rolesList={rolesList}
                  setRolesList={setRolesList}
                  setOpenRoles={setOpenRoles}
                />
              </AppsContent>
              <Hidden smUp>
                <AppsPagination
                  rowsPerPage={10}
                  count={total}
                  page={page}
                  onPageChange={onPageChange}
                />
              </Hidden>
            </AppCard>
          </Grid>
        </Slide>
      </AppGridContainer>
      <Tooltip title='ADD ROLE'>
        <Fab
          style={{color: '#fff'}}
          id='fabBtn'
          color='primary'
          aria-label='add'
          onClick={handleAddRole}
          size='small'
          sx={{
            position: 'absolute',
            bottom: 19,
            right: 18,
            color: blue[500],
          }}
        >
          <Add />
        </Fab>
      </Tooltip>
      <Box
        position='absolute'
        bottom={10}
        left={15}
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Hidden smDown>
          <AppsPagination
            rowsPerPage={10}
            count={total}
            page={page}
            onPageChange={onPageChange}
          />
        </Hidden>
      </Box>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle>{'Upgrade your plan'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            Your current plan is limited to a certain number of users. To
            accommodate more users, you may need to consider upgrading your
            plan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={navigatetoUpgrade}>Upgrade</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={opendialogdept}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby='alert-dialog-slide-description'
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle>{'No Department Available'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            To create Role you must have to create department first
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={navigateToDept}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openrole}
        keepMounted
        aria-describedby='alert-dialog-slide-description'
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle sx={{fontSize: '16px'}}>
          <Tooltip title='CLOSE'>
            <IconButton
              onClick={handleCloseRole}
              aria-label='close'
              style={{
                position: 'absolute',
                right: '8px',
                top: '8px',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          {isedit ? 'EDIT ROLE' : 'CREATE ROLE'}
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              {!isedit && (
                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    id='tags-outlined'
                    options={deptdata}
                    getOptionLabel={(option) => option.deptName}
                    value={selecteddept}
                    onChange={(event, value) => setselectedDept(value)}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: '100%',
                          my: 2,
                        }}
                        {...params}
                        variant='outlined'
                        required
                        label='Select Department'
                        placeholder='Select The Department'
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={12}>
                <TextField
                  variant='outlined'
                  value={roleDisplayname}
                  required
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  onChange={(event) => {
                    const {value} = event.target;
                    setRoleDisplayName(value);
                  }}
                  label={'Role Name'}
                  placeholder='Enter Role Name'
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant='outlined'
                  value={roleName}
                  required
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  onChange={(event) => {
                    const {value} = event.target;
                    setRoleName(value);
                  }}
                  label={'Role Short Name'}
                  placeholder='Enter Role Short Name'
                />
              </Grid>
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={handleCloseRole}>Cancel</Button>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={loading}
            >
              {isedit ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={openRoles}
        onClose={() => setOpenRoles(false)}
        aria-labelledby='draggable-dialog-title'
        PaperComponent={PaperComponent}
        fullWidth
        maxWidth='xs'
      >
        <Box className={classes.flexBetween}>
          <DialogTitle
            id='draggable-dialog-title'
            className={classes.dialogTitle}
            style={{cursor: 'move'}}
          >
            Users
          </DialogTitle>
          <div style={{display: 'flex'}}>
            <AddUserAction
              className={classes.closeButton}
              deptName={rowdata?.department?.deptName}
              roleName={rowdata?.roleName}
              setTriggerApi={setTriggerApi}
              setOpenRoles={setOpenRoles}
              roles={rowdata?.user}
            />
            <Tooltip title='CLOSE'>
              <IconButton
                onClick={() => setOpenRoles(false)}
                className={classes.closeButton}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          </div>
        </Box>
        <DialogContent dividers className={classes.dialogContent}>
          <RolesTable
            tableData={rolesList}
            setOpenRoles={setOpenRoles}
            setRolesList={setRolesList}
            setRowData={setRowData}
            handleupdate={handleupdate}
            setTriggerApi={setTriggerApi}
            rowData={rowdata}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductListing;
