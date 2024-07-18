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
  Fab,
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
import AddDomain from './AddDomain';
import {toast} from 'react-toastify';
import SaveIcon from '@mui/icons-material/Save';
import {useDispatch, useSelector} from 'react-redux';
import {
  getApplicationsData,
  getUsersData,
  resetUsersDashboard,
} from 'redux/features/usersDashboardSlice';
import {Add} from '@mui/icons-material';

const ProductListing = () => {
  const {usersDataIsLoading} = useSelector((state) => state.usersDashboard);
  const dispatch = useDispatch();
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
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [updatedItemsState, setUpdatedItemsState] = useState([]);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState(0);
  const [licensetier, setLicenseTier] = useState('');
  const [tableData, setTableData] = useState([]);
  const [itemsState, setItemsState] = useState([]);
  const [open, setOpen] = useState(false);
  const [opendomain, setOpenDomain] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [domainStatus, setDomainStatus] = useState(null);
  const [domain, setDomain] = useState('');
  const [product, setProduct] = useState(10);
  const [applicationName, setApplicationName] = useState('TeamSync');

  const {
    usersData,
    usersDataIsSuccess,
    applicationsData,
    applicationsDataIsSuccess,
  } = useSelector((state) => state.usersDashboard);

  sessionStorage.setItem('appName', applicationName);

  const handleChange = (event) => {
    setProduct(event.target.value);
    switch (event.target.value) {
      case 10:
        setApplicationName('TeamSync');
        break;
      case 20:
        setApplicationName('OmniLearn Pro');
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

  const handleOpenNote = () => {
    setOpenNote(true);
  };

  console.log(licensetier, 'licensetier');

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseNote = () => {
    setOpenNote(false);
  };

  const activeUsersCount = updatedItemsState.filter(
    (item) => item.active_status === true,
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
        const applicationuserRemaining =
          response?.data?.usersRemaining[applicationName];
        setLicense(applicationuserRemaining || '0');
        const applicationLicenseTier =
          response?.data?.licenseTier[applicationName];
        setLicenseTier(applicationLicenseTier || '');
      })
      .catch((error) => {
        console.log(error);
      });
  }, [product]);

  const onPageChange = (event, value) => {
    setPage(value);
    console.log(value, 'value');
  };

  console.log(product, 'valueofproduct');

  useEffect(() => {
    dispatch(getUsersData({searchText: '', pageNumber: page, applicationName}));
  }, [page, product, applicationName]);

  useEffect(() => {
    setLoading(usersDataIsLoading);
  }, [usersDataIsLoading]);

  useEffect(() => {
    if (usersDataIsSuccess) {
      setList(usersData?.content);
      setTotal(usersData?.totalElements);
    }
  }, [usersDataIsSuccess]);

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
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/setUserData`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: updatedItemsState,
    };
    setLoading(true);
    axios
      .request(config)
      .then((response) => {
        setLoading(false);
        console.log(JSON.stringify(response.data));
        // const RemainingUsers = response.headers['usersRemaining'];
        const applicationuserRemaining =
          response?.data?.usersRemaining[applicationName];
        setLicense(applicationuserRemaining || '0');
        // setLicense(response?.data?.usersRemaining);
        setList(response?.data?.allUsers?.content);
        setTotal(response?.data?.allUsers?.totalElements);
        setItemsState([]);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const navigatetoRoles = () => {
    Navigate('/roles');
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

  const handleToggleActiveState = () => {
    const updatedState = itemsState.map((item) =>
      selectedUsers.some((user) => user.id === item.id)
        ? {...item, active: !item.active}
        : item,
    );
    setItemsState(updatedState);
  };

  const handlegotoupgrade = () => {
    Navigate('/upgrade');
  };

  const handletiername = () => {
    if (licensetier === 'PLATINUM') {
      return 30;
    } else if (licensetier === 'GOLD') {
      return 20;
    } else if (licensetier === 'BASIC') {
      return 10;
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
                  license={license}
                  handletiername={handletiername}
                  setSelectedUsers={setSelectedUsers}
                  selectedUsers={selectedUsers}
                  handleToggleActiveState={handleToggleActiveState}
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

      <Tooltip title='SAVE CHANGES'>
        <Fab
          id='fabBtn'
          color='primary'
          style={{color: '#fff'}}
          aria-label='add'
          onClick={handlesaveChanges}
          // disabled={disable}
          size='small'
          sx={{
            position: 'absolute',
            bottom: 19,
            right: 15,
            color: blue[500],
          }}
        >
          <SaveIcon />
        </Fab>
      </Tooltip>
      <Tooltip title='ADD USER'>
        <Fab
          style={{color: '#fff'}}
          id='fabBtn'
          color='primary'
          aria-label='add'
          onClick={HandleNavigate}
          size='small'
          sx={{
            position: 'absolute',
            bottom: 19,
            right: 65,
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
          <Button onClick={handlegotoupgrade}>Upgrade</Button>
        </DialogActions>
      </Dialog>

      <Dialog
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
      </Dialog>

      <Dialog
        open={openNote}
        keepMounted
        onClose={handleCloseNote}
        aria-describedby='alert-dialog-slide-description'
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle>{'INFORMATION'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            You don not have any role to assign to the user; please go and
            create one first.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNote}>Cancel</Button>
          <Button onClick={navigatetoRoles}>Add Role</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductListing;
