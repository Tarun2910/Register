import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import {useGetDataApi} from '@crema/hooks/APIHooks';
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
  TextField,
  Tooltip,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
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
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import IntlMessages from '@crema/helpers/IntlMessages';
import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import {debounce} from 'lodash';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import AddDomain from './AddDomain';
import {toast} from 'react-toastify';

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

  const [updatedItemsState, setUpdatedItemsState] = useState([]);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState(0);
  const [licensetier, setLicenseTier] = useState('');
  const [tableData, setTableData] = useState([]);
  const [itemsState, setItemsState] = useState([]);
  const [open, setOpen] = useState(false);
  const [opendomain, setOpenDomain] = useState(false);
  const [domainStatus, setDomainStatus] = useState(null);
  const [domain, setDomain] = useState('');
  const [product, setProduct] = useState(10);
  const [applicationName, setApplicationName] = useState('OmniLearn');

  const handleChange = (event) => {
    setProduct(event.target.value);
    switch (event.target.value) {
      case 10:
        setApplicationName('OmniLearn');
        break;
      case 20:
        setApplicationName('TeamSync');
        break;
      case 30:
        setApplicationName('Claros');
        break;
      default:
        setApplicationName('');
    }
  };

  function PaperComponent(props) {
    return (
      <Draggable
        handle='#draggable-dialog-title'
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  const navigate = useNavigate();

  const updateDomain = (event) => {
    const {value} = event.target;
    setDomain(value);
  };

  useEffect(() => {
    if (domain === '') {
      setDomainStatus(null);
    }
  }, [domain]);

  useEffect(() => {
    const checkDomainAvailability = debounce(() => {
      setLoading(true);
      axios
        .get(
          `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/public/domains?emailDomain=@${domain}`,
        )
        .then((response) => {
          setLoading(false);
          console.log(response, 'response');
          if (response.status === 200) {
            setDomainStatus('available');
          } else if (response.status === 409) {
            setDomainStatus('unavailable');
          }
        })
        .catch((error) => {
          setLoading(false);
          setDomainStatus('unavailable');
        });
    }, 500); // Debounce time in milliseconds

    if (domain) {
      checkDomainAvailability();
    }

    return () => {
      checkDomainAvailability.cancel();
    };
  }, [domain]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const activeUsersCount = updatedItemsState.filter(
    (item) => item.active === true,
  ).length;

  console.log(activeUsersCount, tableData, 'tableData');

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/info`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        sessionStorage.setItem('AdminName', response.data.adminName);
        sessionStorage.setItem(
          'licenceTierTeamsync',
          response.data.licenseTier.TeamSync,
        );
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

  console.log(product, 'valueofproduct');

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users?pageNum=${page}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        ApplicationName: applicationName,
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
  }, [page, product, applicationName]);

  // useEffect(() => {
  //   if (product === 20) {
  //     setList([
  //       {
  //         id: '65d46a043c24ef0fcc7e5047',
  //         email: 'tarun@apple.com',
  //         name: 'Tarun',
  //         tenantId: '65d46a043c24ef0fcc7e5046',
  //         reportsTo: null,
  //         subordinates: [],
  //         roles: [],
  //         active: false,
  //       },
  //       {
  //         id: '65d46b1d3c24ef0fcc7e5048',
  //         email: 'vishal@apple.com',
  //         name: 'Vishal',
  //         tenantId: '65d46a043c24ef0fcc7e5046',
  //         reportsTo: null,
  //         subordinates: ['65d46b1f3c24ef0fcc7e504a'],
  //         roles: ['admin'],
  //         active: false,
  //       },
  //       {
  //         id: '65d46b1e3c24ef0fcc7e5049',
  //         email: 'rishabh@apple.com',
  //         name: 'Rishabh',
  //         tenantId: '65d46a043c24ef0fcc7e5046',
  //         reportsTo: null,
  //         subordinates: [],
  //         roles: [],
  //         active: false,
  //       },
  //       {
  //         id: '65d46b1f3c24ef0fcc7e504a',
  //         email: 'aman@apple.com',
  //         name: 'Aman',
  //         tenantId: '65d46a043c24ef0fcc7e5046',
  //         reportsTo: '65d46b1d3c24ef0fcc7e5048',
  //         subordinates: [],
  //         roles: [],
  //         active: false,
  //       },
  //       {
  //         id: '65d474ff3c24ef0fcc7e504b',
  //         email: 'dheeraj@amazon.com',
  //         name: 'Dheeraj',
  //         tenantId: '65d46a043c24ef0fcc7e5046',
  //         reportsTo: null,
  //         subordinates: [],
  //         roles: [],
  //         active: false,
  //       },
  //     ]);
  //   }
  //   if (product === 30) {
  //     setList([
  //       {
  //         id: '65d46a043c24ef0fcc7e5047',
  //         email: 'rishabh@apple.com',
  //         name: 'Rishabh',
  //         tenantId: '65d46a043c24ef0fcc7e5046',
  //         reportsTo: null,
  //         subordinates: [],
  //         roles: [],
  //         active: true,
  //       },
  //       {
  //         id: '65d46b1d3c24ef0fcc7e5048',
  //         email: 'aman@apple.com',
  //         name: 'Aman',
  //         tenantId: '65d46a043c24ef0fcc7e5046',
  //         reportsTo: null,
  //         subordinates: ['65d46b1f3c24ef0fcc7e504a'],
  //         roles: ['admin'],
  //         active: false,
  //       },
  //     ]);
  //   }
  // }, [product]);

  const searchProduct = (title) => {
    setFilterData({...filterData, title});
  };

  const HandleNavigate = () => {
    Navigate('/addUser');
  };

  const handlesaveChanges = () => {
    // Check if remaining license is less than the count of active users
    const activeUsersCount = updatedItemsState.filter(
      (item) => item.active === true,
    ).length;

    const inactiveUsersCount = updatedItemsState.filter(
      (item) => item.active === false,
    ).length;

    const TotalLength = activeUsersCount - inactiveUsersCount;

    console.log(TotalLength, license, 'activeuserCount');

    if (license < TotalLength) {
      handleClickOpen();
    }
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users/status`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        setList(response?.data?.content);
        setTotal(response?.data?.totalElements);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/applications`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const handleAddDomain = () => {
    console.log('clicked');
  };

  const handleopenDomain = () => {
    setOpenDomain(true);
  };

  const handlecloseDomain = () => {
    setOpenDomain(false);
  };

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center', // Align items vertically
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
          {/* <CustomizedBreadcrumbs label='Home' showComponentName={false} /> */}
          <Typography sx={{fontWeight: Fonts.SEMI_BOLD}}>OmniLearn</Typography>
        </span>

        {/* <span style={{display: 'inline-flex', alignItems: 'center'}}>
          <FormControl sx={{minWidth: '10rem', marginRight: '10px'}}>
            <InputLabel id='demo-simple-select-label'>Products</InputLabel>
            <Select
              sx={{height: '2rem', width: '100%'}} // Set height and width
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={product}
              label='Products'
              onChange={handleChange}
            >
              <MenuItem value={10}>OmniLearn</MenuItem>
              <MenuItem value={20}>TeamSync</MenuItem>
              <MenuItem value={30}>Claros</MenuItem>
            </Select>
          </FormControl>
          <Button
            color='primary'
            variant='outlined'
            size='small'
            onClick={handlegotoupgrade}
          >
            Activate new plan
          </Button>
          <Typography
            variant='body1'
            sx={{marginLeft: '10px', fontWeight: Fonts.SEMI_BOLD}}
          >
            Remaining License: {license} of {handletiername()}
          </Typography>
        </span> */}
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
                        onClick={handlesaveChanges}
                        disabled={disable}
                      >
                        Save Changes
                      </Button>

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
