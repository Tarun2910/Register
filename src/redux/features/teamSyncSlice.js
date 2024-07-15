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
        '/dms_service_LM/api/dms_admin_service/storageStats',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            username: localStorage.getItem('username'),
            pageSize: payload.pageSize,
            pageNumber: payload.pageNumber,
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
    resetStorageData(state) {
      state.storageData = {};
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
      })
      .addCase(getStorageData.rejected, (state, action) => {
        state.storageData = {};
        state.storageDataIsLoading = false;
        state.storageDataIsError = true;
        state.storageDataError = action.error.message;
        state.storageDataIsSuccess = false;
        toast(action.error.message, {autoClose: 2000, type: 'error'});
      });
  },
});

export const {resetStorageData} = teamSyncSlice.actions;

export default teamSyncSlice.reducer;
