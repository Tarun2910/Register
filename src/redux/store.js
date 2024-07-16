import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import authReducer from './features/authSlice';
import usersReducer from './features/usersSlice';
import teamSyncReducer from './features/teamSyncSlice';
import usersDashboardReducer from './features/usersDashboardSlice';
import rolesDataReducer from './features/rolesDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: usersReducer,
    teamSync: teamSyncReducer,
    usersDashboard: usersDashboardReducer,
    roles: rolesDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

setupListeners(store.dispatch);
