import {createSlice} from '@reduxjs/toolkit';
import {
  createAsyncThunkWithTokenRefresh,
  createAxiosConfig,
} from '../common/commonFunctions';
import axios from 'axios';
import {toast} from 'react-toastify';

const initialState = {
  departmentsData: {},
  departmentsDataIsLoading: false,
  departmentsDataIsError: false,
  departmentsDataError: '',
  departmentsDataIsSuccess: false,
};

export const getDepartmentsData = createAsyncThunkWithTokenRefresh(
  'departments/data',
  async (token, currentUser, payload) => {
    try {
      const response = await axios.get(
        `/tenants/departments?search=${payload.searchText}`,
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

export const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    resetDepartmentsData(state) {
      state.departmentsData = {};
      state.departmentsDataIsLoading = false;
      state.departmentsDataIsError = false;
      state.departmentsDataError = '';
      state.departmentsDataIsSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getDepartmentsData.pending, (state) => {
        state.departmentsData = {};
        state.departmentsDataIsLoading = true;
        state.departmentsDataIsError = false;
        state.departmentsDataError = '';
        state.departmentsDataIsSuccess = false;
      })
      .addCase(getDepartmentsData.fulfilled, (state, action) => {
        console.log(action.payload);
        state.departmentsData = action.payload;
        state.departmentsDataIsLoading = false;
        state.departmentsDataIsError = false;
        state.departmentsDataError = '';
        state.departmentsDataIsSuccess = true;
      })
      .addCase(getDepartmentsData.rejected, (state, action) => {
        state.departmentsData = {};
        state.departmentsDataIsLoading = false;
        state.departmentsDataIsError = true;
        state.departmentsDataError = action.error.message;
        state.departmentsDataIsSuccess = false;
        toast(action.error.message, {autoClose: 2000, type: 'error'});
      });
  },
});

export const {resetDepartmentsData} = departmentsSlice.actions;

export default departmentsSlice.reducer;