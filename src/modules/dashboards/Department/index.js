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
  Divider,
  IconButton,
  TextField,
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
import CloseIcon from '@mui/icons-material/Close';

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
  const [opendept, setOpenDept] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [deptname, setdeptName] = useState('');
  const [deptdisplayname, setdeptDisplayName] = useState('');
  const [branch, setbranchCity] = useState('');
  const [triggerApi, setTriggerApi] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [isedit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const debouncedSearch = debounce((searchQuery) => {
    setSearchData(searchQuery);
    setPage(0); // Reset page when performing a new search
  }, 500);

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
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/departments?search=${searchData}`,

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
        setList(response?.data?.content);
        setTotal(response?.data?.totalElements);
        sessionStorage.setItem(
          'DepartmentCount',
          response?.data?.totalElements,
        );
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [page, triggerApi, searchData]);

  const HandleNavigate = () => {
    Navigate('/add-department');
  };

  const navigatetoUpgrade = () => {
    Navigate('/upgrade');
  };

  const handleopenDept = () => {
    setdeptDisplayName('');
    setdeptName('');
    setbranchCity('');
    setOpenDept(true);
    setIsEdit(false);
  };

  const handlecloseDept = () => {
    setOpenDept(false);
    setIsEdit(false);
  };

  const handleCreateDept = () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/departments`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        deptName: deptname,
        deptDisplayName: deptdisplayname,
        branchCity: branch,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setLoading(false);
        console.log(JSON.stringify(response.data));
        setTriggerApi((prevState) => !prevState);
        handlecloseDept();
        toast.success('Department Created successfully!');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        handlecloseDept();
        toast.error(error?.response?.data?.error);
      });
  };

  const updateDepartment = () => {
    setOpenDept(true);
    setIsEdit(true);
  };
  const handleupdate = () => {
    const config = {
      method: 'put',
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/departments`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        deptName: deptname,
        deptDisplayName: deptdisplayname,
        branchCity: branch,
        tenantId: rowData.tenantId,
        id: rowData.id,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setLoading(false);
        setTriggerApi((prev) => !prev);
        handlecloseDept();
        toast.success('Department Updated successfully!');
      })
      .catch((error) => {
        setLoading(false);
        handlecloseDept();
        toast.error(
          error?.response?.data?.error || 'Failed to update department',
        );
      });
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    isedit ? handleupdate() : handleCreateDept();
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
                      onChange={(event) => debouncedSearch(event.target.value)}
                      placeholder={messages['common.searchHere']}
                    />
                    <Box
                      display='flex'
                      flexDirection='row'
                      alignItems='center'
                      justifyContent='flex-end'
                    >
                      <Tooltip title='ADD Department' onClick={handleopenDept}>
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
                  setIsEdit={setIsEdit}
                  updateDepartment={updateDepartment}
                  setSelectedDeptId={setSelectedDeptId}
                  setdeptName={setdeptName}
                  setdeptDisplayName={setdeptDisplayName}
                  setbranchCity={setbranchCity}
                  setRowData={setRowData}
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
        open={opendept}
        keepMounted
        aria-describedby='alert-dialog-slide-description'
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle sx={{fontSize: '16px'}}>
          <Tooltip title='CLOSE'>
            <IconButton
              onClick={handlecloseDept}
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
          {isedit ? 'EDIT DEPARTMENT' : 'CREATE DEPARTMENT'}
        </DialogTitle>
        <Divider />
        <form onSubmit={handlesubmit}>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant='outlined'
                  value={deptdisplayname}
                  placeholder='Enter Department Name'
                  required
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  onChange={(event) => {
                    const {value} = event.target;
                    setdeptDisplayName(value);
                  }}
                  label={'Department Name'}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant='outlined'
                  value={deptname}
                  required
                  placeholder='Enter department Short Name'
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  onChange={(event) => {
                    const {value} = event.target;
                    setdeptName(value);
                  }}
                  label={'Department Short Name'}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant='outlined'
                  value={branch}
                  placeholder='Enter your Branch'
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  onChange={(event) => {
                    const {value} = event.target;
                    setbranchCity(value);
                  }}
                  label={'Branch'}
                />
              </Grid>
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={handlecloseDept}>Cancel</Button>
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
    </>
  );
};

export default ProductListing;
