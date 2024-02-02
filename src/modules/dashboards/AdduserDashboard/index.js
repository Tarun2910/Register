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

const ProductListing = () => {
  const {messages} = useIntl();
  const Navigate = useNavigate();
  const [filterData, setFilterData] = useState({
    title: '',
    inStock: [],
    mrp: {start: 0, end: 30000},
  });

  const [page, setPage] = useState(0);
  // const [list, setList] = useState([
  //   {id: '1', name: 'tarun', email: 'tarun@costacloud', active_status: false},
  //   {id: '2', name: 'new', email: 'new@costacloud', active_status: true},
  //   {id: '3', name: 'demo', email: 'new@costacloud', active_status: true},
  // ]);
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
  const [tableData, setTableData] = useState([]);
  const [itemsState, setItemsState] = useState([]);

  const activeUsersCount = updatedItemsState.filter(
    (item) => item.active_status === true,
  ).length;

  console.log(activeUsersCount, tableData, 'tableData');

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8081/tenants',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setLicense(response?.data?.usersRemaining);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onPageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setQueryParams({filterData, page});
  }, [filterData, page]);

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8081/tenants/users',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setList(response?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

    console.log(activeUsersCount, license, 'activeuserCount');

    if (license < activeUsersCount) {
      // Show a dialog or handle the validation error here
      // For example, you can set a state to trigger the dialog in your component
      // setValidationError(true);
      alert(
        "'Validation Error: Remaining license is insufficient for active users.',",
      );

      return;
    }
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8081/tenants/users/status',
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
        setList(response?.data?.allUsers);
        setItemsState([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // This will position 'users.list' and 'remainingLicense' at the extremes
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        <span>{messages['users.list']}</span>

        <span> Remaining License: {license}</span>
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
                      // onChange={(event) => searchCourseData(event.target.value)}
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
    </>
  );
};

export default ProductListing;
