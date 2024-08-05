import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {toast} from 'react-toastify';

export const createAxiosConfig = (
  token,
  currentUser,
  additionalHeaders = {},
) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    Rolename: currentUser?.roleName,
    ...additionalHeaders,
  },
  maxBodyLength: Infinity,
});

// Separate function for token refresh
export const refreshAccessToken = async (thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('refreshToken', sessionStorage.getItem('refresh_token'));
    formData.append('userEmail', sessionStorage.getItem('username'));
    formData.append('appName', 'TeamSync');

    const refreshResponse = await axios.post(
      `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/public/refreshToken`,
      formData,
      {
        headers: {},
      },
    );

    sessionStorage.setItem('token', refreshResponse.data.access_token);
    sessionStorage.setItem('sessionId', refreshResponse.data.session_state);

    return refreshResponse.data;
  } catch (refreshError) {
    console.log(refreshError);
    window.location.href = '/signin';
    sessionStorage.clear();
    sessionStorage.clear();
    return refreshError;
  }
};

// Create an async thunk with token refresh functionality
export const createAsyncThunkWithTokenRefresh = (type, requestFunction) =>
  createAsyncThunk(`${type}`, async (payload, thunkAPI) => {
    try {
      // Get the token from the session storage
      const token = sessionStorage.getItem('token');
      const currentUser = thunkAPI.getState().user.currentUser;

      // Make the initial request using the provided function and token
      const response = await requestFunction(token, currentUser, payload);

      // Return the response data
      return response?.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 504) {
        // Check for gateway timeout error
        throw new Error('Gateway Timeout');
      }

      // Check for gateway timeout error
      else if (error.response && error.response.status === 404) {
        throw new Error('Resource not found');
      }

      // Check if the server is stopped with a 500 error and no specific error message
      else if (
        error.response &&
        error.response.status === 500 &&
        !error.response.data.error
      ) {
        throw new Error(
          'There was an error with the internal server. Please contact your site administrator.',
        );
      }

      // Handle unauthorized (401) error (access token expired)
      else if (error.response && error.response.status === 401) {
        // Attempt to refresh the access token
        const refreshedToken = await refreshAccessToken(thunkAPI);
        console.log(refreshedToken);

        // Check for gateway timeout error after token refresh
        if (refreshedToken.response && refreshedToken.response.status === 504) {
          throw new Error('Gateway Timeout');
        }

        // Check for gateway timeout error
        else if (
          refreshedToken.response &&
          refreshedToken.response.status === 404
        ) {
          throw new Error('Resource not found');
        }

        // Check if the server is stopped with a 500 error and no specific error message after token refresh
        else if (
          refreshedToken.response &&
          refreshedToken.response.status === 500 &&
          !refreshedToken.response.data.message
        ) {
          throw new Error(
            'There was an error with the internal server. Please contact your site administrator.',
          );
        }

        // Handle unauthorized (401) error after token refresh (refresh token expired)
        else if (
          refreshedToken.response &&
          refreshedToken.response?.status === 401
        ) {
          // Manually set an error in the Redux state
          if (
            refreshedToken.response?.data?.message == 'Invalid Refresh Token!!'
          ) {
            toast('Your login has been expired', {
              autoClose: 2000,
              type: 'error',
            });
            setTimeout(() => {
              window.location.href = '/signin';

              return;
            }, 1000);
          } else {
            throw new Error(refreshedToken.response?.data?.message);
          }
        } else if (refreshedToken?.access_token) {
          // If token refresh is successful, retry the original request with the new access token
          try {
            const retryResponse = await requestFunction(
              refreshedToken?.access_token,
              payload,
            );

            // Return the response data from the retry
            return retryResponse.data;
          } catch (error) {
            // Handle errors in the retry request
            throw new Error(error.response?.data?.error || 'An error occurred');
          }
        }
      } else if (error.message == 'Network Error') {
        throw new Error(
          'There was an error with the internal server. Please contact your site administrator.',
        );
      } else if (!error.response) {
        throw new Error(
          'There was an error with the internal server. Please contact your site administrator.',
        );
      } else {
        // Throw a generic error if none of the specific error conditions are met
        throw new Error(error.response?.data?.error || 'An error occurred');
      }
    }
  });
