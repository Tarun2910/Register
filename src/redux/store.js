import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import authReducer from './features/authSlice';
import usersReducer from './features/usersSlice';
import teamSyncReducer from './features/teamSyncSlice';
import usersDashboardReducer from './features/usersDashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: usersReducer,
    teamSync: teamSyncReducer,
    usersDashboard: usersDashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

setupListeners(store.dispatch);
