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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';
import UpdateIcon from '@mui/icons-material/Update';

import Draggable from 'react-draggable';

import {debounce} from 'lodash';
import {toast} from 'react-toastify';

const ProductListing = ({
  list,
  setList,
  totalUserCount,
  pendingUserCount,
  activeUserCount,
  inactiveUserCount,
  totalDeptCount,
  page,
  setPage,
}) => {
  console.log(totalUserCount, totalDeptCount, 'jjj');
  const {messages} = useIntl();
  const Navigate = useNavigate();

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
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [showUsers, setShowUsers] = useState(true);

  console.log(list, 'storageData');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const activeUsersCount = updatedItemsState.filter(
    (item) => item.active === true,
  ).length;

  const onPageChange = (event, value) => {
    setPage(value);
    console.log(value, 'value');
  };

  // useEffect(() => {
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/getUserData`,

  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       pageSize: '10',
  //       pageNumber: page,
  //       userName: sessionStorage.getItem('username'),
  //       deptName: 'ALL_USER',
  //     },
  //   };
  //   setLoading(true);
  //   axios
  //     .request(config)
  //     .then((response) => {
  //       setLoading(false);
  //       console.log(response.data);
  //       setList(response?.data?.data);
  //       setTotal(response?.data?.count);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.log(error);
  //     });
  // }, [page]);

  console.log(list, 'list');

  const transformApiResponse = (data) => {
    // Map individual user stats
    const userStats = data.individualUsersStats.map((user) => ({
      id: user.userName,
      userId: user.userName,
      deptName: null,
      accessLevel: null,
      accessCode: null,
      displayStorage: `${(user.currentlyUsedStorage / 1024).toFixed(2)} KB`,
      allowedStorageInBytes: user.totalAllocatedStorage,
      currentStorageInBytes: user.currentlyUsedStorage,
      allowedStorageInBytesDisplay: `${(
        user.totalAllocatedStorage /
        (1024 * 1024 * 1024)
      ).toFixed(2)} GB`,
      usedPercent:
        (user.currentlyUsedStorage / user.totalAllocatedStorage) * 100,
      deptUsername: null,
      deptDisplayUsername: null,
      roleName: null,
      displayRoleName: null,
      tenantId: null,
      licenseTier: null,
      isDMS_CreateType: false,
      userOrDept: user.userOrDept,
    }));

    // Map individual department stats
    const deptStats = data.individualDeptsStats.map((dept) => ({
      id: dept.deptName,
      userId: dept.deptName,
      deptName: dept.deptName,
      accessLevel: null,
      accessCode: null,
      displayStorage: `${(dept.currentlyUsedStorage / 1024).toFixed(2)} KB`,
      allowedStorageInBytes: dept.totalAllocatedStorage,
      currentStorageInBytes: dept.currentlyUsedStorage,
      allowedStorageInBytesDisplay: `${(
        dept.totalAllocatedStorage /
        (1024 * 1024 * 1024)
      ).toFixed(2)} GB`,
      usedPercent:
        (dept.currentlyUsedStorage / dept.totalAllocatedStorage) * 100,
      deptUsername: null,
      deptDisplayUsername: null,
      roleName: null,
      displayRoleName: null,
      tenantId: null,
      licenseTier: null,
      isDMS_CreateType: false,
      userOrDept: dept.userOrDept,
    }));

    // Combine user and department stats
    return [...userStats, ...deptStats];
  };

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

  // const updateUsersPermissions = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/setUserData`,
  //       list,
  //       {
  //         headers: {
  //           Authorization: 'Bearer ' + localStorage.getItem('token'),
  //           username: sessionStorage.getItem('username'),
  //           deptName: sessionStorage.getItem('username'),
  //           pageNumber: '0',
  //           pageSize: '10',
  //         },
  //       },
  //     );
  //     console.log(response);

  //     // if (searchValue) {
  //     //   let regex = /^([^\(]+)\s+\(([^)]+)\)$/;
  //     //   // Executing the regular expression on the input string
  //     //   let match = searchValue.match(regex);

  //     //   let name = match[1].trim();
  //     //   let role = match[2].trim();

  //     //   let updatedUser = response.data.data.find(
  //     //     (user) =>
  //     //       user?.displayRoleName === role &&
  //     //       user?.deptDisplayUsername === name,
  //     //   );
  //     //   setList([updatedUser]);
  //     // } else {
  //     //   setUsersData(response.data.data);
  //     // }

  //     toast.success('Users Permissions Updated Successfully');
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error?.response?.data?.error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateUsersPermissions = async () => {
    setLoading(true);

    // Create a new list with the updated active statuses and storage information
    const updatedList = list.map((item) => {
      console.log(item, 'item');
      const updatedItem = itemsState.find(
        (stateItem) => stateItem.id === item.id,
      );

      return updatedItem
        ? {
            ...item,
            active: updatedItem.active,
            allowedStorageInBytesDisplay:
              updatedItem.allowedStorageInBytesDisplay,
            allowedStorageInBytes: updatedItem.allowedStorageInBytes, // Assuming this is the field name
            currentStorageInBytes: updatedItem.currentStorageInBytes, // Assuming this is the field name
          }
        : item;
    });

    try {
      const response = await axios.post(
        `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/setUserData`,
        updatedList,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            username: sessionStorage.getItem('username'),
            deptName: sessionStorage.getItem('username'),
            pageNumber: '0',
            pageSize: '10',
          },
        },
      );
      console.log(response);
      toast.success('Users Permissions Updated Successfully');
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const navigatetoUpgrade = () => {
    Navigate('/upgrade');
  };

  const searchData = (searchQuery) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${
        window.__ENV__.REACT_APP_MIDDLEWARE
      }/tenants/users?keyword=${searchQuery}&pageNum=${'0'}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // setList(response?.data?.data);
        // setTotal(response?.data?.totalElements);
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

  // const filteredData = showUsers
  //   ? list.filter((item) => item.userOrDept === 'User')
  //   : list.filter((item) => item.userOrDept === 'Department');

  // console.log(filteredData, 'filteredData');
  console.log(pendingUserCount, inactiveUserCount, activeUserCount, 'seedata');
  const filteredData = list.filter((item) => {
    if (!showUsers) return item.userOrDept === 'Department';
    if (filterStatus === 'ALL') return item.userOrDept === 'User';
    if (filterStatus === 'ACTIVE') return item.status === 'active';
    if (filterStatus === 'INACTIVE') return item.status === 'inactive';
    if (filterStatus === 'PENDING') return item.status === 'pending';
    return true;
  });

  console.log(filterStatus, 'filterStatus');

  useEffect(() => {
    if (!showUsers) {
      setFilterStatus('DEPT');
    } else {
      setFilterStatus('ALL');
    }
  }, [showUsers]);

  return (
    <>
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
                    {/* <AppSearchBar
                      iconPosition='right'
                      overlap={false}
                      onChange={(event) => searchData(event.target.value)}
                      placeholder={messages['common.searchHere']}
                    /> */}
                    <Hidden smDown>
                      <AppsPagination
                        rowsPerPage={10}
                        // count={showUsers ? totalUserCount : totalDeptCount}
                        count={
                          filterStatus === 'ALL'
                            ? totalUserCount
                            : filterStatus === 'ACTIVE '
                            ? activeUserCount
                            : filterStatus === 'INACTIVE'
                            ? inactiveUserCount
                            : filterStatus === 'PENDING'
                            ? pendingUserCount
                            : filterStatus === 'DEPT'
                            ? totalDeptCount
                            : 0
                        }
                        page={page}
                        onPageChange={onPageChange}
                      />
                    </Hidden>
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
                      </Button> */}

                      {showUsers && (
                        <FormControl
                          variant='outlined'
                          sx={{
                            minWidth: 100,
                            marginRight: '8px',
                            fontSize: '0.875rem',
                          }} // Adjusted minWidth and marginRight
                          disabled={!showUsers}
                        >
                          <InputLabel sx={{fontSize: '0.875rem'}}>
                            Status
                          </InputLabel>
                          <Select
                            sx={{
                              height: '1.5rem',
                              width: '100%',
                              fontSize: '0.875rem',
                              padding: '0.25rem',
                            }} // Adjusted height, fontSize, and padding
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label='Status'
                          >
                            <MenuItem value='ALL' sx={{fontSize: '0.875rem'}}>
                              ALL
                            </MenuItem>
                            <MenuItem
                              value='ACTIVE'
                              sx={{fontSize: '0.875rem'}}
                            >
                              ACTIVE
                            </MenuItem>
                            <MenuItem
                              value='INACTIVE'
                              sx={{fontSize: '0.875rem'}}
                            >
                              INACTIVE
                            </MenuItem>
                            <MenuItem
                              value='PENDING'
                              sx={{fontSize: '0.875rem'}}
                            >
                              PENDING
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      <Tooltip
                        title={showUsers ? 'Show Departments' : 'Show Users'}
                      >
                        <IconButton
                          sx={{marginRight: '10px'}}
                          color='primary'
                          size='small'
                          onClick={() => setShowUsers(!showUsers)}
                        >
                          {showUsers ? <GroupIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Tooltip>

                      {/* <Tooltip title='Update'>
                        <IconButton
                          sx={{marginRight: '10px'}}
                          color='primary'
                          size='small'
                          onClick={updateUsersPermissions}
                          // disabled={disable}
                        >
                          <UpdateIcon />
                        </IconButton>
                      </Tooltip> */}
                    </Box>
                  </Box>
                </AppsHeader>
              }
              sx={{
                minHeight: 'calc(100vh - 168px)',
                height: '100px',
              }}
              headerStyle={{p: 0}}
              contentStyle={{p: 0}}
            >
              <AppsContent
                sx={{
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <ListingTable
                  productData={filteredData || []}
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
                  showUsers={showUsers}
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
    </>
  );
};

export default ProductListing;

ProductListing.propTypes = {
  list: PropTypes.any,
  setList: PropTypes.any,
  totalUserCount: PropTypes.any,
  totalDeptCount: PropTypes.any,
  page: PropTypes.any,
  setPage: PropTypes.any,
  activeUserCount: PropTypes.any,
  inactiveUserCount: PropTypes.any,
  pendingUserCount: PropTypes.any,
};
