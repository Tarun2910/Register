import {createSlice} from '@reduxjs/toolkit';
import {
  createAsyncThunkWithTokenRefresh,
  createAxiosConfig,
} from '../common/commonFunctions';
import axios from 'axios';
import {toast} from 'react-toastify';

const initialState = {
  rolesData: {},
  rolesDataIsLoading: false,
  rolesDataIsError: false,
  rolesDataError: '',
  rolesDataIsSuccess: false,
};

export const getRolesData = createAsyncThunkWithTokenRefresh(
  'roles/data',
  async (token, currentUser, payload) => {
    try {
      const response = await axios.get(
        `/tenants/roles?search=${payload.searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            username: localStorage.getItem('username'),
            pageSize: payload.pageSize,
            pageNumber: payload.pageNumber,
            deptName: 'ALL_USER',
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

export const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    resetRolesData(state) {
      // state.rolesData = {};
      state.rolesDataIsLoading = false;
      state.rolesDataIsError = false;
      state.rolesDataError = '';
      state.rolesDataIsSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getRolesData.pending, (state) => {
        state.rolesData = {};
        state.rolesDataIsLoading = true;
        state.rolesDataIsError = false;
        state.rolesDataError = '';
        state.rolesDataIsSuccess = false;
      })
      .addCase(getRolesData.fulfilled, (state, action) => {
        console.log(action.payload);
        state.rolesData = action.payload;
        state.rolesDataIsLoading = false;
        state.rolesDataIsError = false;
        state.rolesDataError = '';
        state.rolesDataIsSuccess = true;
        resetRolesData();
      })
      .addCase(getRolesData.rejected, (state, action) => {
        state.rolesData = {};
        state.rolesDataIsLoading = false;
        state.rolesDataIsError = true;
        state.rolesDataError = action.error.message;
        state.rolesDataIsSuccess = false;
        toast(action.error.message, {autoClose: 2000, type: 'error'});
      });
  },
});

export const {resetRolesData} = rolesSlice.actions;

export default rolesSlice.reducer;
