import React, {useState, useEffect, useCallback} from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Tooltip,
  Icon,
  FormControlLabel,
  Checkbox,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  InputAdornment,
  LinearProgress,
  Divider,
} from '@material-ui/core';
import {Done, Search} from '@mui/icons-material';
import Axios from 'axios';
import {fetchUsersPermissions} from 'app/redux/actions/TeamSync/userPermissionActions';
import {useDispatch, useSelector} from 'react-redux';
import {Loading} from '../theme-source/loading';
import {setSnackbar} from 'app/camunda_redux/redux/ducks/snackbar';
import {debounce} from 'utils';
import {loadDmsUSerData} from 'app/camunda_redux/redux/action';
import PaginationComp from 'app/views/utilities/PaginationComp';
import {Autocomplete} from '@material-ui/lab';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{position: 'relative', display: 'inline-flex'}}>
      <CircularProgress variant='determinate' {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='caption' component='div' color='text.secondary'>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const AdminSettings = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await Axios.get(
        '/dms_service_LM/api/dms_admin_service/getUserData',
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('jwt_token'),
            username: localStorage.getItem('username'),
            deptName: sessionStorage.getItem('department'),
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        },
      );

      setUsersData(response.data.data);
      setTotalCount(response.data.count);
    } catch (error) {
      console.log('fetchUsersError', error);
      callMessageOut('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue) {
      // Regular expression pattern to extract name and role
      let regex = /^([^\(]+)\s+\(([^)]+)\)$/;

      // Executing the regular expression on the input string
      let match = searchValue?.match(regex);

      let name = match[1]?.trim();
      let role = match[2]?.trim();

      let userArr = users?.find(
        (user) =>
          user?.displayRoleName === role && user?.deptDisplayUsername === name,
      );
      setUsersData([userArr]);
    } else {
      fetchUsers();
    }
  }, [searchValue, pageNumber, pageSize]);

  const updateUsersPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await Axios.post(
        '/dms_service_LM/api/dms_admin_service/setUserData',
        usersData,
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('jwt_token'),
            username: localStorage.getItem('username'),
            deptName: sessionStorage.getItem('department'),
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        },
      );
      console.log(response);

      if (searchValue) {
        let regex = /^([^\(]+)\s+\(([^)]+)\)$/;
        // Executing the regular expression on the input string
        let match = searchValue.match(regex);

        let name = match[1].trim();
        let role = match[2].trim();

        let updatedUser = response.data.data.find(
          (user) =>
            user?.displayRoleName === role &&
            user?.deptDisplayUsername === name,
        );
        setUsersData([updatedUser]);
      } else {
        setUsersData(response.data.data);
      }

      callMessageOut('success', 'Users Permissions Updated Successfully');
    } catch (error) {
      console.log(error);
      callMessageOut('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (userId, field, newValue) => {
    if (field === 'allowedStorageInBytesDisplay') {
      let totalBytes;
      let valueArr = newValue?.split(' ');
      if (valueArr[1] === 'GB') {
        totalBytes = 1073741824;
      } else {
        totalBytes = valueArr[0];
      }
      const newArr = usersData.map((user) =>
        user.id === userId
          ? {...user, [field]: newValue, allowedStorageInBytes: totalBytes}
          : user,
      );
      setUsersData(newArr);
    } else {
      const newArr = usersData.map((user) =>
        user.id === userId ? {...user, [field]: newValue} : user,
      );
      setUsersData(newArr);
    }
  };

  const getUsers = async (inputValue) => {
    try {
      const response = await Axios.get(
        '/dms_service_LM/api/dms_admin_service/getUserSmrt',
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('jwt_token'),
            username: localStorage.getItem('username'),
            deptName: sessionStorage.getItem('department'),
            patternString: inputValue,
          },
        },
      );

      console.log('getUserNameSmart', response);
      setUsers(response?.data?.data);
    } catch (error) {
      console.log('getUserNameSmart', error);
      callMessageOut('error', error.message);
    }
  };

  const optimizedFn = useCallback(debounce(getUsers), []);

  console.log('searchValue', searchValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUsersPermissions();
  };

  return (
    <>
      <Box mb={1} px={3}>
        <Autocomplete
          freeSolo
          id='free-solo-2-demo'
          value={searchValue}
          onChange={(event, newValue) => {
            setSearchValue(newValue);
          }}
          onInputChange={(e) => e && optimizedFn(e.target.value)}
          options={users?.map(
            (user) => `${user.deptDisplayUsername} (${user.displayRoleName})`,
          )}
          style={{fontSize: '0.85rem'}}
          renderInput={(params) => (
            <TextField
              {...params}
              label='SEARCH USER'
              variant='outlined'
              className={theme ? 'darkTextField' : ''}
            />
          )}
        />
      </Box>
      <div>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {isLoading && <Loading />}

            <Box
              sx={{
                border: '1px solid #DCDCDC',
                borderRadius: '5px',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}
            >
              <TableContainer
                style={{
                  height: '220px',
                  maxHeight: '220px',
                  overflowY: 'scroll',
                }}
                className='permission-table-body'
              >
                <Table stickyHeader={true}>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>USERID</TableCell>
                      <TableCell>USERNAME</TableCell>
                      <TableCell align='center' colSpan={2}>
                        PERMISSIONS
                      </TableCell>
                      <TableCell align='center'>STORAGE USED</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className='permission-table-body'>
                    {usersData?.length > 0 ? (
                      usersData?.map((user, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell
                              align='center'
                              style={{
                                fontSize: '0.89rem',
                              }}
                            >
                              {/ {user?.displayRoleName} /}
                              {user?.userId}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: '0.89rem',
                              }}
                            >
                              {user?.deptDisplayUsername
                                ? user?.deptDisplayUsername
                                : 'User not assigned'}
                            </TableCell>
                            <TableCell>
                              <FormControl
                                variant='outlined'
                                style={{minWidth: 150}}
                                size='small'
                              >
                                <InputLabel>ACCESS</InputLabel>
                                <Select
                                  label='ACCESS'
                                  value={user?.accessLevel}
                                  onChange={(event) =>
                                    handleChange(
                                      user.id,
                                      'accessLevel',
                                      event.target.value,
                                    )
                                  }
                                >
                                  <MenuItem value='' disabled>
                                    Select Acess
                                  </MenuItem>
                                  <MenuItem value='VIEWER'>VIEWER</MenuItem>
                                  <MenuItem value='EDITOR'>EDITOR</MenuItem>
                                  <MenuItem value='COMMENTER'>
                                    COMMENTER
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <FormControl
                                variant='outlined'
                                style={{minWidth: 120}}
                                size='small'
                              >
                                <InputLabel>STORAGE</InputLabel>
                                <Select
                                  label='STORAGE'
                                  value={user?.allowedStorageInBytesDisplay}
                                  onChange={(event) =>
                                    handleChange(
                                      user.id,
                                      'allowedStorageInBytesDisplay',
                                      event.target.value,
                                    )
                                  }
                                >
                                  <MenuItem value='' disabled>
                                    Select Storage
                                  </MenuItem>
                                  <MenuItem value='25 MB'>25 MB</MenuItem>
                                  <MenuItem value='50 MB'>50 MB</MenuItem>
                                  <MenuItem value='100 MB'>100 MB</MenuItem>
                                  <MenuItem value='200 MB'>200 MB</MenuItem>
                                  <MenuItem value='500 MB'>500 MB</MenuItem>
                                  <MenuItem value='1 GB'>1 GB</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <LinearProgress
                                variant='determinate'
                                value={user.usedPercent}
                              />
                              <Typography
                                variant='body2'
                                style={{textAlign: 'center'}}
                              >
                                {user.displayStorage} of{' '}
                                {user.allowedStorageInBytesDisplay} used
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <Typography
                        variant='subtitle1'
                        style={{
                          textAlign: 'center',
                          fontStyle: 'italic',
                          color: 'GrayText',
                          position: 'absolute',
                          left: '40%',
                          marginTop: '1rem',
                        }}
                      >
                        No records to display
                      </Typography>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
              <PaginationComp
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalCount={totalCount}
                pageSizes={[5, 10, 15]}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              endIcon={<Done />}
            >
              UPDATE
            </Button>
          </DialogActions>
        </form>
      </div>
    </>
  );
};

export default AdminSettings;
