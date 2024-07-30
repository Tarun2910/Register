import {createSlice} from '@reduxjs/toolkit';
import {
  createAsyncThunkWithTokenRefresh,
  createAxiosConfig,
} from '../common/commonFunctions';
import axios from 'axios';
import {toast} from 'react-toastify';

const initialState = {
  storageData: {},
  storageDataIsLoading: false,
  storageDataIsError: false,
  storageDataError: '',
  storageDataIsSuccess: false,
};

export const getStorageData = createAsyncThunkWithTokenRefresh(
  'teamSync/storage',
  async (token, currentUser, payload) => {
    try {
      const response = await axios.get(
        `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/aggregateStats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            username: localStorage.getItem('username'),
            pageSize: payload.pageSize,
            pageNumber: payload.pageNumber,
            searchText: payload.searchText,
          },
          maxBodyLength: Infinity,
        },
      );
      return response;
    } catch (e) {
      console.log(e);
    }
  },
);

export const teamSyncSlice = createSlice({
  name: 'teamSync',
  initialState,
  reducers: {
    setStorageDataPageNumber(state, action) {
      state.pageNumber = action.payload;
    },

    resetStorageData(state) {
      // state.storageData = {};
      state.storageDataIsLoading = false;
      state.storageDataIsError = false;
      state.storageDataError = '';
      state.storageDataIsSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getStorageData.pending, (state) => {
        state.storageData = {};
        state.storageDataIsLoading = true;
        state.storageDataIsError = false;
        state.storageDataError = '';
        state.storageDataIsSuccess = false;
      })
      .addCase(getStorageData.fulfilled, (state, action) => {
        console.log(action.payload);
        state.storageData = action.payload;
        state.storageDataIsLoading = false;
        state.storageDataIsError = false;
        state.storageDataError = '';
        state.storageDataIsSuccess = true;
        resetStorageData();
      })
      .addCase(getStorageData.rejected, (state, action) => {
        console.log('storing', action);
        state.storageData = {};
        state.storageDataIsLoading = false;
        state.storageDataIsError = true;
        state.storageDataError = action.error.message;
        state.storageDataIsSuccess = false;
        toast(action.error.message, {autoClose: 2000, type: 'error'});
      });
  },
});

export const {resetStorageData, setStorageDataPageNumber} =
  teamSyncSlice.actions;

export default teamSyncSlice.reducer;
