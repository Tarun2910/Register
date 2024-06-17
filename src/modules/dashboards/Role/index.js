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
import {blue} from '@mui/material/colors';
import {useNavigate} from 'react-router-dom';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';

import Draggable from 'react-draggable';

import {debounce} from 'lodash';
import {toast} from 'react-toastify';

const ProductListing = () => {
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
  const [opendialog, setOpenDialog] = useState(false);
  const [openrole, setOpenRole] = useState(false);
  const [deptdata, setDeptData] = useState([]);
  const [selecteddept, setselectedDept] = useState(null);
  const [roles, setRoles] = useState('');
  const [user, setUser] = useState('');

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
      setOpenDialog(true);
    }
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `/multitenant/adminportal/api/getAllRoleDept`,

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf8',
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        pageSize: '10',
        pageNumber: page,
        userName: sessionStorage.getItem('username'),
        deptName: 'ALL_USER',
      },
      data: {filter: null},
    };
    setLoading(true);
    axios
      .request(config)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setList(response?.data?.data);
        setTotal(response?.data?.lenght);
        sessionStorage.setItem('RoleCount', response?.data?.lenght);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [page, triggerApi]);

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
  //       Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
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

  const searchData = (searchQuery) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `/tenants/users?keyword=${searchQuery}&pageNum=${'0'}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setList(response?.data?.content);
        setTotal(response?.data?.totalElements);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `/multitenant/adminportal/api/getAllDept`,

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf8',
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        pageSize: '10',
        pageNumber: page,
        userName: sessionStorage.getItem('username'),
      },
      data: {filter: null},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        setDeptData(response?.data?.data);
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
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/multitenant/adminportal/api/createRoles`,
      headers: {
        userId: selecteddept.id,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
      data: JSON.stringify(userData),
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

  return (
    <>
      {/* <div style={{marginBottom: '1rem'}}>
        <CustomizedBreadcrumbs label='Home' showComponentName={false} />
      </div> */}
      <Box
        component='h2'
        variant='h2'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 15,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        <span>
          <CustomizedBreadcrumbs label='Home' showComponentName={false} />
        </span>
      </Box>
      <AppGridContainer spacing={7}>
        <Slide direction='right' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={12}>
            <AppCard
              title={
                <AppsHeader>
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    width={1}
                    justifyContent='space-between'
                  >
                    <AppSearchBar
                      iconPosition='right'
                      overlap={false}
                      onChange={(event) => searchData(event.target.value)}
                      placeholder={messages['common.searchHere']}
                    />
                    <Box
                      display='flex'
                      flexDirection='row'
                      alignItems='center'
                      justifyContent='flex-end'
                    >
                      {/* <Button
                        sx={{marginRight: '10px'}}
                        color='primary'
                        variant='contained'
                        size='small'
                        onClick={handleopenDomain}
                      >
                        Add domain
                      </Button>
                      <Button
                        sx={{marginRight: '10px'}}
                        color='primary'
                        variant='contained'
                        size='small'
                        onClick={handlesaveChanges}
                        disabled={disable}
                      >
                        Save Changes
                      </Button> */}
                      <Tooltip title='ADD ROLE'>
                        <AddCircleRoundedIcon
                          sx={{
                            color: blue[500],
                            fontSize: 35,
                            cursor: 'pointer',
                          }}
                          onClick={handleAddRole}
                        />
                      </Tooltip>

                      <Hidden smDown>
                        <AppsPagination
                          rowsPerPage={10}
                          count={total}
                          page={page}
                          onPageChange={onPageChange}
                        />
                      </Hidden>
                    </Box>
                  </Box>
                </AppsHeader>
              }
              headerStyle={{p: 0}}
              contentStyle={{p: 0}}
            >
              <AppsContent
                sx={{
                  paddingTop: 2.5,
                  paddingBottom: 2.5,
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
        open={opendialog}
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
        onClose={handleCloseRole}
        aria-describedby='alert-dialog-slide-description'
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle>{'CREATE ROLE'}</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
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
                    label='Select Department'
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                variant='outlined'
                value={roles}
                sx={{
                  width: '100%',
                  my: 2,
                }}
                onChange={(event) => {
                  const {value} = event.target;
                  setRoles(value);
                }}
                label={'Role'}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                variant='outlined'
                value={user}
                sx={{
                  width: '100%',
                  my: 2,
                }}
                onChange={(event) => {
                  const {value} = event.target;
                  setUser(value);
                }}
                label={'User'}
              />
            </Grid>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseRole}>Cancel</Button>
          <Button onClick={handlesaveRole}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductListing;
