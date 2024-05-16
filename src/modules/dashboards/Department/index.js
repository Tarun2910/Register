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

  useEffect(() => {
    setLoading(true);
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
        userName: sessionStorage.getItem('AdminName'),
      },
      data: {filter: null},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        setList(response?.data?.data);
        setTotal(response?.data?.lenght);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [page]);

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
    setLoading(true);
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
        setLoading(false);
        console.log(JSON.stringify(response.data));
        setList(response?.data?.content);
        setTotal(response?.data?.totalElements);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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
            xs: 3,
            lg: 6,
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

                      <Tooltip title='ADD Department' onClick={HandleNavigate}>
                        <AddCircleRoundedIcon
                          sx={{
                            color: blue[500],
                            fontSize: 35,
                            cursor: 'pointer',
                          }}
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

      {/* <Dialog
        open={opendomain}
        keepMounted
        aria-labelledby='draggable-dialog-title'
        PaperComponent={PaperComponent}
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle
          style={{cursor: 'move', fontSize: '15px'}}
          id='draggable-dialog-title'
          className='dialofAction'
        >
          <Tooltip title='CLOSE'>
            <IconButton
              onClick={handlecloseDomain}
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
          ADD DOMAIN
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <AddDomain
              setLoading={setLoading}
              setDomainStatus={setDomainStatus}
              setDomain={setDomain}
              loading={loading}
              domain={domain}
              domainStatus={domainStatus}
            />
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handlecloseDomain}>Cancel</Button>
          <Button
            variant='contained'
            color='primary'
            disabled={loading || domainStatus === 'unavailable'}
            onClick={handlecloseDomain}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default ProductListing;
