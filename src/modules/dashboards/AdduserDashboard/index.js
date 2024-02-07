import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import {Box, Button, Grid, Hidden, Tooltip} from '@mui/material';
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
import AlertDialogSlide from 'modules/muiComponents/feedback/Dialog/AlertDialogSlide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';

const ProductListing = () => {
  const {messages} = useIntl();
  const Navigate = useNavigate();
  const [filterData, setFilterData] = useState({
    title: '',
    inStock: [],
    mrp: {start: 0, end: 30000},
  });

  const [page, setPage] = useState(0);
  const [list, setList] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [total, setTotal] = useState(0);
  const [{apiData, loading}, {setQueryParams}] = useGetDataApi(
    '/api/ecommerce/list',
    [],
    {},
    false,
  );
  const [updatedItemsState, setUpdatedItemsState] = useState([]);
  const [disable, setDisable] = useState(false);
  const [license, setLicense] = useState(0);
  const [licensetier, setLicenseTier] = useState('');
  const [tableData, setTableData] = useState([]);
  const [itemsState, setItemsState] = useState([]);
  const [open, setOpen] = React.useState(false);

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const activeUsersCount = updatedItemsState.filter(
    (item) => item.active_status === true,
  ).length;

  console.log(activeUsersCount, tableData, 'tableData');

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `/tenants/info`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setLicense(response?.data?.usersRemaining);
        setLicenseTier(response?.data?.licenseTier);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onPageChange = (event, value) => {
    setPage(value);
    console.log(value, 'value');
  };
  useEffect(() => {
    setQueryParams({filterData, page});
  }, [filterData, page]);

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `/tenants/users?pageNum=${page}`,
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
  }, [page]);

  const searchProduct = (title) => {
    setFilterData({...filterData, title});
  };

  const HandleNavigate = () => {
    Navigate('/addUser');
  };

  const handlesaveChanges = () => {
    // Check if remaining license is less than the count of active users
    const activeUsersCount = updatedItemsState.filter(
      (item) => item.active_status === true,
    ).length;

    const inactiveUsersCount = updatedItemsState.filter(
      (item) => item.active_status === false,
    ).length;

    const TotalLength = activeUsersCount - inactiveUsersCount;

    console.log(TotalLength, license, 'activeuserCount');

    if (license < TotalLength) {
      handleClickOpen();
    }
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/tenants/users/status',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
      data: updatedItemsState,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // const RemainingUsers = response.headers['usersRemaining'];
        setLicense(response?.data?.usersRemaining);
        setList(response?.data?.allUsers?.content);
        setTotal(response?.data?.allUsers?.totalElements);
        setItemsState([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const handlegotoupgrade = () => {
    Navigate('/upgrade');
  };

  const handletiername = () => {
    if (licensetier === 'growth') {
      return 20;
    } else if (licensetier === 'pro') {
      return 30;
    } else {
      return 5;
    }
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
          justifyContent: 'space-between', // This will position 'users.list' and 'remainingLicense' at the extremes
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

        <span>
          {' '}
          Remaining License: {license} of {handletiername()}
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
                      <Button
                        sx={{marginRight: '10px'}}
                        color='primary'
                        variant='contained'
                        size='small'
                        onClick={handlegotoupgrade}
                      >
                        Activate new plan
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
                      </Button>

                      <Tooltip title='ADD USER' onClick={HandleNavigate}>
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
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
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
