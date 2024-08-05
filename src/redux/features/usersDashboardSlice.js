import {createSlice} from '@reduxjs/toolkit';
import {
  createAsyncThunkWithTokenRefresh,
  createAxiosConfig,
} from '../common/commonFunctions';
import axios from 'axios';
import {toast} from 'react-toastify';

const initialState = {
  usersData: {},
  usersDataIsLoading: false,
  usersDataIsError: false,
  usersDataError: '',
  usersDataIsSuccess: false,

  applicationsData: {},
  applicationsDataIsLoading: false,
  applicationsDataIsError: false,
  applicationsDataError: '',
  applicationsDataIsSuccess: false,
};

export const getUsersData = createAsyncThunkWithTokenRefresh(
  'users/tableData',
  async (token, currentUser, payload) => {
    console.log(payload);
    let url =
      payload.searchText == ''
        ? `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users?filter=${
            payload.filter || 'all'
          }`
        : `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users?keyword=${payload.searchText}&pageNum=${payload.pageNumber}&filter=${payload.filter}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        sortBy: payload.sortOrder,
        searchText: payload.searchText,
        appName: payload.applicationName,
        pageNumber: payload.pageNumber,
      },
      maxBodyLength: Infinity,
    });
    console.log(response.data);
    return response;
  },
);

export const getApplicationsData = createAsyncThunkWithTokenRefresh(
  'users/applicationsData',
  async (token, currentUser, payload) => {
    try {
      const response = await axios.get('/tenants/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          username: sessionStorage.getItem('username'),
          searchText: payload.searchText,
        },
        maxBodyLength: Infinity,
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  },
);

export const usersDataboardSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setStorageDataPageNumber(state, action) {
      state.pageNumber = action.payload;
    },

    resetUsersDashboard(state) {
      // state.usersData = {};
      state.usersDataIsLoading = false;
      state.usersDataIsError = false;
      state.usersDataError = '';
      state.usersDataIsSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUsersData.pending, (state) => {
        state.usersData = {};
        state.usersDataIsLoading = true;
        state.usersDataIsError = false;
        state.usersDataError = '';
        state.usersDataIsSuccess = false;
      })
      .addCase(getUsersData.fulfilled, (state, action) => {
        console.log(action.payload);
        state.usersData = action.payload;
        state.usersDataIsLoading = false;
        state.usersDataIsError = false;
        state.usersDataError = '';
        state.usersDataIsSuccess = true;
        resetUsersDashboard();
      })
      .addCase(getUsersData.rejected, (state, action) => {
        state.usersData = {};
        state.usersDataIsLoading = false;
        state.usersDataIsError = true;
        state.usersDataError = action.error.message;
        state.usersDataIsSuccess = false;
        toast(action.error.message, {autoClose: 2000, type: 'error'});
      })
      .addCase(getApplicationsData.pending, (state) => {
        state.applicationsData = {};
        state.applicationsDataIsLoading = true;
        state.applicationsDataIsError = false;
        state.applicationsDataError = '';
        state.applicationsDataIsSuccess = false;
      })
      .addCase(getApplicationsData.fulfilled, (state, action) => {
        console.log(action.payload);
        state.applicationsData = action.payload;
        state.applicationsDataIsLoading = false;
        state.applicationsDataIsError = false;
        state.applicationsDataError = '';
        state.applicationsDataIsSuccess = true;
      })
      .addCase(getApplicationsData.rejected, (state, action) => {
        state.applicationsData = {};
        state.applicationsDataIsLoading = false;
        state.applicationsDataIsError = true;
        state.applicationsDataError = action.error.message;
        state.applicationsDataIsSuccess = false;
        toast(action.error.message, {autoClose: 2000, type: 'error'});
      });
  },
});

export const {resetUsersDashboard, setStorageDataPageNumber} =
  usersDataboardSlice.actions;

export default usersDataboardSlice.reducer;
