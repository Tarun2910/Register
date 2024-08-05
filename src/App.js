// import React from 'react';
// import {BrowserRouter} from 'react-router-dom';
// import CssBaseline from '@mui/material/CssBaseline';
// import AppContextProvider from '@crema/context/AppContextProvider';
// import AppThemeProvider from '@crema/context/AppThemeProvider';
// import AppStyleProvider from '@crema/context/AppStyleProvider';
// import AppLocaleProvider from '@crema/context/AppLocaleProvider';
// import InfoViewContextProvider from '@crema/context/AppContextProvider/InfoViewContextProvider';
// import AppAuthProvider from '@crema/core/AppAuthProvider';
// import AuthRoutes from '@crema/components/AuthRoutes';
// import AppLayout from '@crema/core/AppLayout';
// import '@crema/mockapi';
// import './styles/index.css';
// import {Provider} from 'react-redux';
// import {store} from 'redux/store';

// const App = () => (
//   <Provider store={store}>
//     <AppContextProvider>
//       <AppThemeProvider>
//         <AppStyleProvider>
//           <AppLocaleProvider>
//             <BrowserRouter>
//               <InfoViewContextProvider>
//                 <AppAuthProvider>
//                   <AuthRoutes>
//                     <CssBaseline />
//                     <AppLayout />
//                   </AuthRoutes>
//                 </AppAuthProvider>
//               </InfoViewContextProvider>
//             </BrowserRouter>
//           </AppLocaleProvider>
//         </AppStyleProvider>
//       </AppThemeProvider>
//     </AppContextProvider>
//   </Provider>
// );

// export default App;

import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppContextProvider from '@crema/context/AppContextProvider';
import AppThemeProvider from '@crema/context/AppThemeProvider';
import AppStyleProvider from '@crema/context/AppStyleProvider';
import AppLocaleProvider from '@crema/context/AppLocaleProvider';
import InfoViewContextProvider from '@crema/context/AppContextProvider/InfoViewContextProvider';
import AppAuthProvider from '@crema/core/AppAuthProvider';
import AuthRoutes from '@crema/components/AuthRoutes';
import AppLayout from '@crema/core/AppLayout';
import '@crema/mockapi';
import './styles/index.css';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from 'redux/store';
import CloseIcon from '@mui/icons-material/Close';
import {Tooltip} from '@mui/material';
import {authRefreshAction} from 'redux/features/authSlice';

const ExpiryWarningModal = () => {
  const dispatch = useDispatch();
  // Access state from Redux store
  const {showexpiredwarning, showupcomingexpiry} = useSelector((state) => ({
    showexpiredwarning: state.auth.showexpiredwarning,
    showupcomingexpiry: state.auth.showupcomingexpiry,
  }));

  // Local state to control visibility of warnings
  const [showExp, setShowExp] = useState(showexpiredwarning);
  const [showComExp, setShowComExp] = useState(showupcomingexpiry);

  // Update local state if Redux state changes
  useEffect(() => {
    setShowExp(showexpiredwarning);
    setShowComExp(showupcomingexpiry);
  }, [showexpiredwarning, showupcomingexpiry]);

  useEffect(() => {
    dispatch(authRefreshAction());
  }, []);

  return (
    <>
      {showExp && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            left: '5rem',
            right: '1rem',
            fontSize: '14px',
            background: '#EEF2FF',
            color: '#222222',
            zIndex: '999999999',
            textAlign: 'left',
            border: '1px solid #EEEEEE',
            padding: '10px 11px',
            borderRadius: '8px',
            fontFamily: 'Helvetica Neue, Helvetica, Arial',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{flexGrow: 1}}>
            Your account or subscription is nearing expiration. Please renew it
            to continue enjoying our services.
          </div>
          <div>
            <Tooltip title='Close'>
              <CloseIcon
                style={{cursor: 'pointer'}}
                onClick={() => setShowExp(false)}
              />
            </Tooltip>
          </div>
        </div>
      )}
      {showComExp && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            left: '5rem',
            right: '1rem',
            fontSize: '14px',
            background: '#EEF2FF',
            color: '#222222',
            zIndex: '999999999',
            textAlign: 'left',
            border: '1px solid #EEEEEE',
            padding: '10px 11px',
            borderRadius: '8px',
            fontFamily: 'Helvetica Neue, Helvetica, Arial',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{flexGrow: 1}}>
            Your account or subscription is nearing expiration. Please renew it
            to continue enjoying our services.
          </div>
          <div>
            <Tooltip title='Close'>
              <CloseIcon
                style={{cursor: 'pointer'}}
                onClick={() => setShowComExp(false)}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContextProvider>
        <AppThemeProvider>
          <AppStyleProvider>
            <AppLocaleProvider>
              <BrowserRouter>
                <InfoViewContextProvider>
                  <AppAuthProvider>
                    <AuthRoutes>
                      <CssBaseline />
                      <AppLayout />
                      <ExpiryWarningModal />
                    </AuthRoutes>
                  </AppAuthProvider>
                </InfoViewContextProvider>
              </BrowserRouter>
            </AppLocaleProvider>
          </AppStyleProvider>
        </AppThemeProvider>
      </AppContextProvider>
    </Provider>
  );
};

export default App;
