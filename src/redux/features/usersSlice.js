import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  // get user details
  currentUser: {},
  userData: {},
  userDataIsLoading: false,
  userDataIsError: false,
  userDataError: '',
  userDataIsSuccess: false,
};

const refreshAccessToken = async (thunkAPI) => {
  try {
    const refresh_token = sessionStorage.getItem('refresh_token');

    const refreshResponse = await axios.post(
      `${window.__ENV__.REACT_APP_MIDDLEWARE}/auth/refresh-token`,
      {
        refresh_token: refresh_token,
        grant_type: 'refresh_token',
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    sessionStorage.setItem('token', refreshResponse.data.access_token);
    sessionStorage.setItem('sessionId', refreshResponse.data.session_state);

    return refreshResponse.data;
  } catch (refreshError) {
    return refreshError;
  }
};

export const getUserDetailsAction = createAsyncThunk(
  'user/getUserDetailsAction',
  async () => {
    try {
      const headers = {};
      const sessionId = sessionStorage.getItem('sessionId');
      const username = sessionStorage.getItem('username');
      const token = sessionStorage.getItem('token');

      if (sessionId) {
        headers['sessionId'] = sessionId;
      }

      if (username) {
        headers['username'] = username;
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(
        `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/info`,
        {
          headers: {
            Accept: 'application/json',
            ...headers,
          },
        },
      );

      sessionStorage.setItem('AdminName', response.data.adminName);
      sessionStorage.setItem(
        'licenceTierTeamsync',
        response.data.licenseTier.TeamSync,
      );

      return response.data;
    } catch (error) {
      // checking for getway timeout error
      if (error.response && error.response.status === 504) {
        throw new Error('Gateway Timeout');
      }

      // checking if server is stopped
      if (
        (error.response &&
          error.response.status === 500 &&
          !error.response.data.error) ||
        (error.response &&
          error.response.status === 500 &&
          !error.response.data.message)
      ) {
        throw new Error(
          'There was an error with the internal server. Please contact your site administrator.',
        );
      }
      throw new Error(error.response.data.error);
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetgetUserDetailsAction(state) {
      state.userDataIsLoading = false;
      state.userDataIsError = false;
      state.userDataError = '';
      state.userDataIsSuccess = false;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
  extraReducers(builder) {
    builder

      // get user details
      .addCase(getUserDetailsAction.pending, (state) => {
        state.userData = {};
        state.userDataIsLoading = true;
        state.userDataIsError = false;
        state.userDataError = '';
        state.userDataIsSuccess = false;
      })
      .addCase(getUserDetailsAction.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.userData = action.payload;
        state.userDataIsLoading = false;
        state.userDataIsError = false;
        state.userDataError = '';
        state.userDataIsSuccess = true;
      })
      .addCase(getUserDetailsAction.rejected, (state, action) => {
        // console.log("Inside error", action)

        state.userData = {};
        state.userDataIsLoading = false;
        state.userDataIsError = true;
        state.userDataError = action.error.message;
        state.userDataIsSuccess = false;
      });
  },
});

export const {resetgetUserDetailsAction, setCurrentUser} = userSlice.actions;

export default userSlice.reducer;
