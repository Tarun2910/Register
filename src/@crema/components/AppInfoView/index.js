import React from 'react';

const AppInfoViewContext = React.lazy(() => import('./ContextView'));
const AppInfoViewRedux = React.lazy(() => import('./ReduxView'));

const AppInfoView = () => {
  if (window.__ENV__.REACT_APP_STATE_TYPE === 'context') {
    return <AppInfoViewContext />;
  }
  return <AppInfoViewRedux />;
};

export default AppInfoView;
